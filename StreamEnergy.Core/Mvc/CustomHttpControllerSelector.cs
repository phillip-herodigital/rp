using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Dispatcher;
using System.Web.Http.Routing;
using Sitecore.Services.Infrastructure.Web.Http.Dispatcher;
using Sitecore.Services.Core;
 
namespace StreamEnergy.Mvc
{
    /// <summary>
    /// Created this class to recreate the logic Sitecore does in the following class: Sitecore.Services.Infrastructure.Web.Http.Dispatcher.NamespaceHttpControllerSelector
    /// This ControllerSelector checks if there is a controllername present, the way sitecore sends it, if not,
    /// use the default WebApi DefaultHttpControllerSelector to handle the AttributeMapping routes made in de Global.asax
    /// 
    /// Source: http://wp-bartbovendeerdtcom.azurewebsites.net/sitecore-8-webapi-v2-mvc-and-attribute-routing/
    /// </summary>
    public class CustomHttpControllerSelector : DefaultHttpControllerSelector
    {
        private const string NamespaceKey = "namespace";
        private const string ControllerKey = "controller";
        private readonly HttpConfiguration _configuration;
        private readonly IControllerNameGenerator _controllerNameGenerator;
        private readonly Dictionary<string, HttpControllerDescriptor> _controllers;
        public CustomHttpControllerSelector(HttpConfiguration config, IControllerNameGenerator controllerNameGenerator)
            : base(config)
        {
            this._configuration = config;
            this._controllerNameGenerator = controllerNameGenerator;
            this._controllers = this.InitializeControllerDictionary();
        }
 
        private Dictionary<string, HttpControllerDescriptor> InitializeControllerDictionary()
        {
            Dictionary<string, HttpControllerDescriptor> dictionary = new Dictionary<string, HttpControllerDescriptor>(StringComparer.OrdinalIgnoreCase);
            IAssembliesResolver assembliesResolver = this._configuration.Services.GetAssembliesResolver();
            IHttpControllerTypeResolver httpControllerTypeResolver = this._configuration.Services.GetHttpControllerTypeResolver();
            ICollection<Type> controllerTypes = httpControllerTypeResolver.GetControllerTypes(assembliesResolver);
            foreach (Type current in controllerTypes)
            {
                string name = this._controllerNameGenerator.GetName(current);
                if (!dictionary.Keys.Contains(name))
                {
                    dictionary[name] = new HttpControllerDescriptor(this._configuration, current.Name, current);
                }
            }
            return dictionary;
        }
 
        public override HttpControllerDescriptor SelectController(HttpRequestMessage request)
        {
            IHttpRouteData routeData = request.GetRouteData();
            string namespaceVariable = GetRouteVariable<string>(routeData, "namespace");
            string controllerVariable = GetRouteVariable<string>(routeData, "controller");
 
            if (string.IsNullOrEmpty(controllerVariable))
                return base.SelectController(request);
 
            HttpControllerDescriptor httpControllerDescriptor = this.FindMatchingController(namespaceVariable, controllerVariable);
            if (httpControllerDescriptor != null)
            {
                return httpControllerDescriptor;
            }
 
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
 
        private static T GetRouteVariable<T>(IHttpRouteData routeData, string name)
        {
            object obj;
            if (routeData.Values.TryGetValue(name, out obj))
            {
                return (T)((object)obj);
            }
            return default(T);
        }
 
        private HttpControllerDescriptor FindMatchingController(string namespaceName, string controllerName)
        {
            string key = string.IsNullOrEmpty(namespaceName) ? controllerName : string.Format(CultureInfo.InvariantCulture, "{0}.{1}", new object[]
			{
				namespaceName,
				controllerName
			});
            HttpControllerDescriptor result;
            if (this._controllers.TryGetValue(key, out result))
            {
                return result;
            }
            return null;
        }
    }
}