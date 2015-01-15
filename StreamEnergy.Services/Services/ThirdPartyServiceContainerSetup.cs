using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.Services.Clients;

namespace StreamEnergy.Services
{
    public class ThirdPartyServiceContainerSetup : Unity.IContainerSetupStrategy
    {
        public void SetupUnity(Microsoft.Practices.Unity.IUnityContainer unityContainer)
        {
            unityContainer.RegisterInstance<string>("DpiEnrollmentFormDomain", ConfigurationManager.AppSettings["DpiEnrollmentFormDomain"]);
            unityContainer.RegisterInstance<string>("DpiAuthID", ConfigurationManager.AppSettings["DpiAuthID"]);
            unityContainer.RegisterInstance<string>("DpiAuthPwd", ConfigurationManager.AppSettings["DpiAuthPwd"]);

            unityContainer.RegisterType<StreamEnergyBilling.IstaTokenization.IDpiTokenService>(new InjectionFactory(uc => new StreamEnergyBilling.IstaTokenization.DpiTokenServiceClient()));
            unityContainer.RegisterType<Interpreters.IDpiEnrollmentParameters, Interpreters.DpiEnrollmentParameters>();
            unityContainer.RegisterType<Clients.ISitecoreProductData, Clients.SitecoreProductData>();

            unityContainer.RegisterType<ISet<ILocationAdapter>>(new ContainerControlledLifetimeManager(), new InjectionFactory(uc => new HashSet<ILocationAdapter>
                {
                    uc.Resolve<TexasAdapter>(),
                    uc.Resolve<GeorgiaAdapter>(),
                    uc.Resolve<MobileAdapter>()
                }));
        }
    }
}
