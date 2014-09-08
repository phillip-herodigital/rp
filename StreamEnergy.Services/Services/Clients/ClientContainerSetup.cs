using Castle.DynamicProxy;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Security;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Services.Clients.Interceptors;
using System.Net.Http;
using System.Configuration;

namespace StreamEnergy.Services.Clients
{
    public class ClientContainerSetup : Unity.InheritanceSetupStrategy
    {
        private static readonly ProxyGenerator proxyGenerator = new ProxyGenerator();
        
        public ClientContainerSetup()
            : base(typeof(TemperatureService))
        {
        }

        protected override IEnumerable<Type> GetParentTypes(Type instanceType)
        {
            return instanceType.GetInterfaces().Except(new[]
            {
                typeof(Unity.IContainerSetupStrategy),
                typeof(IInterceptor),
                typeof(IServiceInterceptor),
                typeof(IRestServiceInterceptor)
            });
        }

        protected override void AdditionalSetup(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<ServiceInterceptorResolver>(new ContainerControlledLifetimeManager());

            unityContainer.RegisterType<HttpClient>(new InjectionFactory(uc => new HttpClient(uc.Resolve<HttpMessageHandler>("Cached"), false)));
            unityContainer.RegisterType<HttpMessageHandler>("Cached", new InjectionFactory(uc => new HttpMessageInterceptor(uc.Resolve<ServiceInterceptorResolver>(), uc.Resolve<HttpMessageHandler>("Logged"))));
            unityContainer.RegisterType<HttpMessageHandler, HttpMessageLogger>("Logged");
            unityContainer.RegisterType<HttpMessageHandler, HttpClientHandler>();

            RegisterService<Sample.Temperature.TempConvertSoap>(unityContainer, new Sample.Temperature.TempConvertSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.w3schools.com/webservices/tempconvert.asmx")));
            RegisterService<Sample.Commons.SampleStreamCommonsSoap>(unityContainer, new Sample.Commons.SampleStreamCommonsSoapClient(new System.ServiceModel.BasicHttpBinding(), new System.ServiceModel.EndpointAddress("http://www.example.com/webservices")));
            RegisterService<StreamEnergy.Dpi.DPILinkSoap>(unityContainer, new StreamEnergy.Dpi.DPILinkSoapClient(new System.ServiceModel.BasicHttpsBinding(), new System.ServiceModel.EndpointAddress("https://live.soap.dataparadigm.com:6080/dpilink.asmx?WSDL")));

            var CisAccountServicesPortTypeClient = new StreamCommons.Account.CisAccountServicesPortTypeClient(new System.ServiceModel.BasicHttpsBinding(), new System.ServiceModel.EndpointAddress("https://sgecom.datx.streamenergy.net/CisAccountServices/WebServices/SoapServer.php?wsdl"));
            CisAccountServicesPortTypeClient.ChannelFactory.Endpoint.EndpointBehaviors.Add(new AddAuthenticationHeaderBehavior("mystream", "R|38ULt6w1@o55v"));
            RegisterService<StreamCommons.Account.CisAccountServicesPortType>(unityContainer, CisAccountServicesPortTypeClient);

            unityContainer.RegisterInstance("SmartyStreets AuthId", ConfigurationManager.AppSettings["SmartyStreetsAuthId"]);
            unityContainer.RegisterInstance("SmartyStreets AuthToken", ConfigurationManager.AppSettings["SmartyStreetsAuthToken"]);

            unityContainer.RegisterType<SmartyStreets.ISmartyStreetService, SmartyStreets.SmartyStreetService>();

            // TODO - remove this before production
            System.Net.ServicePointManager.ServerCertificateValidationCallback = ValidateServerCertficate;
        }

        private class AddAuthenticationHeaderBehavior : System.ServiceModel.Description.IEndpointBehavior
        {
            private string username { get; set; }
            private string password { get; set; }
            public AddAuthenticationHeaderBehavior(string username, string password)
            {
                this.username = username;
                this.password = password;
            }
            private class AddAuthenticationHeader : System.ServiceModel.Dispatcher.IClientMessageInspector
            {
                private string username { get; set; }
                private string password { get; set; }
                public AddAuthenticationHeader(string username, string password)
                {
                    this.username = username;
                    this.password = password;
                }
                public void AfterReceiveReply(ref System.ServiceModel.Channels.Message reply, object correlationState)
                {
                }

                public object BeforeSendRequest(ref System.ServiceModel.Channels.Message request, IClientChannel channel)
                {
                    var base64String = "Basic " + System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(username + ":" + password));
                    HttpRequestMessageProperty httpRequestMessage;
                    object httpRequestMessageObject;
                    if (request.Properties.TryGetValue(HttpRequestMessageProperty.Name, out httpRequestMessageObject))
                    {
                        httpRequestMessage = httpRequestMessageObject as HttpRequestMessageProperty;
                        httpRequestMessage.Headers["Authorization"] = base64String;
                    }
                    else
                    {
                        httpRequestMessage = new HttpRequestMessageProperty();
                        httpRequestMessage.Headers.Add("Authorization", base64String);
                        request.Properties.Add(HttpRequestMessageProperty.Name, httpRequestMessage);
                    }
                    return null;
                }
            }
            public void AddBindingParameters(System.ServiceModel.Description.ServiceEndpoint endpoint, System.ServiceModel.Channels.BindingParameterCollection bindingParameters)
            {
            }
            public void ApplyClientBehavior(System.ServiceModel.Description.ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.ClientRuntime clientRuntime)
            {
                clientRuntime.MessageInspectors.Add(new AddAuthenticationHeader(username, password));
            }
            public void ApplyDispatchBehavior(System.ServiceModel.Description.ServiceEndpoint endpoint, System.ServiceModel.Dispatcher.EndpointDispatcher endpointDispatcher)
            {
            }
            public void Validate(System.ServiceModel.Description.ServiceEndpoint endpoint)
            {
            }
        }

        private bool ValidateServerCertficate(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certificate, System.Security.Cryptography.X509Certificates.X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
        {
            return true;
        }

        private void RegisterService<TInterface>(IUnityContainer unityContainer, TInterface soapClient)
            where TInterface : class
        {
            unityContainer.RegisterType<TInterface>(new InjectionFactory(uc => proxyGenerator.CreateInterfaceProxyWithTarget(soapClient, uc.Resolve<ServiceInterceptor>())));
        }
    }
}
