using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services
{
    public class ThirdPartyServiceContainerSetup : Unity.IContainerSetupStrategy
    {
        public void SetupUnity(Microsoft.Practices.Unity.IUnityContainer unityContainer)
        {
            unityContainer.RegisterInstance<string>("DpiEnrollmentFormDomain", ConfigurationManager.AppSettings["DpiEnrollmentFormDomain"]);

            unityContainer.RegisterType<StreamEnergyBilling.IstaTokenization.IDpiTokenService>(new InjectionFactory(uc => new StreamEnergyBilling.IstaTokenization.DpiTokenServiceClient()));
        }
    }
}
