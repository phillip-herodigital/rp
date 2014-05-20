using FakeN.Web;
using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace StreamEnergy.MyStream.Tests
{
    public class ContainerSetup
    {
        public static Container Create()
        {
            SetupSitecoreContext();
            var result = new Container(new Microsoft.Practices.Unity.UnityContainer());
            var configuration = WebConfigurationManager.GetWebApplicationSection("streamEnergy") as Configuration.ConfigurationSection;

            result.Initialize((from iocInitializer in configuration.InversionOfControlInitializers
                               let value = iocInitializer.Build()
                               where value != null
                               select value).ToArray());
            SetupHttpContext(result.Unity);
            return result;
        }

        private static void SetupHttpContext(IUnityContainer container)
        {
            var userAgent = "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.10) " +
                "Gecko/20100914 Firefox/3.6.10";
            var browser = new System.Web.HttpBrowserCapabilities
            {
                Capabilities = new Hashtable { { string.Empty, userAgent } }
            };
            var factory = new System.Web.Configuration.BrowserCapabilitiesFactory();
            factory.ConfigureBrowserCapabilities(new NameValueCollection(), browser);

            container.RegisterInstance<System.Web.HttpContextBase>(new FakeHttpContext(new FakeHttpRequest(), new FakeHttpResponse(), new FakeHttpSessionState()));
        }

        private static void SetupSitecoreContext()
        {
            try
            {
                Sitecore.Context.IsUnitTesting = true;
            }
            catch { }

            // switch to the preferred site    
            Sitecore.Context.SetActiveSite("website");

            // set the preferred database
            Sitecore.Context.Database = Sitecore.Context.Site.Database;

            // set the preferred language
            Sitecore.Globalization.Language language = Sitecore.Globalization.Language.Parse(Sitecore.Context.Site.Language);
            Sitecore.Context.SetLanguage(language, false);
        }
    }
}
