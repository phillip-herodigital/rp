using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services.Clients
{
    class StreamConnectContainerSetup : Unity.IContainerSetupStrategy
    {
        public const string StreamConnectKey = "StreamConnect";

        public void SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterInstance<AzureAcsConfiguration>(new AzureAcsConfiguration
            {
                // ACS URL - the URL where the SWT's can be exchanged.
                Url = new Uri(ConfigurationManager.AppSettings["ACS URL"]),
                // ACS Realm - the "wrap_scope"
                Realm = ConfigurationManager.AppSettings["ACS Realm"],
                // ACS Service Identity Name - the name of the "Issuer" for the SWT
                IdentityName = ConfigurationManager.AppSettings["ACS Service Identity Name"],
                // ACS Service Identify [sic] Key - this is how the docs from Pariveda Solutions named it. The shared key used for signing.
                IdentityKey = ConfigurationManager.AppSettings["ACS Service Identify Key"],
            });

            unityContainer.RegisterInstance<Uri>(StreamConnectKey, new Uri(ConfigurationManager.AppSettings["StreamConnect Base Url"]));
            unityContainer.RegisterType<HttpClient>(StreamConnectKey, new InjectionFactory(uc =>
                {
                    var result = new HttpClient(uc.Resolve<AzureAcsTokenHandler>(), false);
                    result.BaseAddress = uc.Resolve<Uri>(StreamConnectKey);
                    return result;
                }));
        }
    }
}
