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
using System.Web.Hosting;
using System.Reflection;

namespace StreamEnergy.MyStream.Tests
{
    public class ContainerSetup
    {
        private static ThreadedContainer threadedContainer;
        private static bool isSitecoreSetup;
        class ThreadedContainer : Container
        {
            System.Threading.ThreadLocal<Container> localContainer = new System.Threading.ThreadLocal<Container>(trackAllValues: true);

            public ThreadedContainer() : base(null)
            {

            }

            public override void Initialize(params IContainerSetupStrategy[] setupStrategies)
            {
                EnsureValue();
                localContainer.Value.Initialize(setupStrategies);
            }

            public override bool IsInitialized
            {
                get
                {
                    EnsureValue();
                    return localContainer.Value.IsInitialized;
                }
            }

            public override T Resolve<T>()
            {
                EnsureValue();
                return localContainer.Value.Resolve<T>();
            }

            public override T Resolve<T>(string name, params ResolverOverride[] resolverOverrides)
            {
                EnsureValue();
                return localContainer.Value.Resolve<T>(name, resolverOverrides);
            }

            public override IUnityContainer Unity
            {
                get
                {
                    EnsureValue();
                    return localContainer.Value.Unity;
                }
            }

            private void EnsureValue()
            {
                if (!localContainer.IsValueCreated)
                {
                    if (localContainer.Values.Count == 1)
                    {
                        localContainer.Value = localContainer.Values.Single();
                    }
                    else
                        throw new InvalidOperationException();
                }
            }

            public void SetContainer(Container container)
            {
                localContainer.Value = container;
            }
        }

        static ContainerSetup()
        {
            Container.Instance = threadedContainer = new ThreadedContainer();
        }

        public static Container Create()
        {
            var result = new Container(new Microsoft.Practices.Unity.UnityContainer());
            threadedContainer.SetContainer(result);
            SetupSitecoreContext();
            var configuration = WebConfigurationManager.GetWebApplicationSection("streamEnergy") as Configuration.ConfigurationSection;

            if (!result.IsInitialized)
            {
                result.Initialize((from iocInitializer in configuration.InversionOfControlInitializers
                                   let value = iocInitializer.Build()
                                   where value != null
                                   select value).ToArray());
            }
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

            Moq.Mock<Mvc.IServerUtility> mockServerUtility = new Moq.Mock<Mvc.IServerUtility>();
            mockServerUtility.Setup(svc => svc.MapPath(Moq.It.IsAny<string>())).Returns<string>((virtualPath) => virtualPath.Replace("~", System.IO.Directory.GetCurrentDirectory()));
            container.RegisterInstance<Mvc.IServerUtility>(mockServerUtility.Object);

        }

        private static void SetupSitecoreContext()
        {
            if (isSitecoreSetup)
                return;
            isSitecoreSetup = true;
            try
            {
                global::Sitecore.Context.IsUnitTesting = true;
            }
            catch { }

            // switch to the preferred site    
            global::Sitecore.Context.SetActiveSite("website");

            // set the preferred database
            global::Sitecore.Context.Database = global::Sitecore.Context.Site.Database;

            // set the preferred language
            global::Sitecore.Globalization.Language language = global::Sitecore.Globalization.Language.Parse(global::Sitecore.Context.Site.Language);
            global::Sitecore.Context.SetLanguage(language, false);
        }
    }
}
