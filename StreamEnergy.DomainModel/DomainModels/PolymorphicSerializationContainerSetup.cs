using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    class PolymorphicSerializationContainerSetup : IContainerSetupStrategy
    {
        void IContainerSetupStrategy.SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.Resolve<TypeIndicatorJsonConverter>().TypeIndicators.Add(new TypeIndicatorLookup
                {
                    Concrete = typeof(TexasServiceCapability),
                    SuperType = typeof(IServiceCapability),
                    IsMatch = j => j["capabilityType"].ToString() == TexasServiceCapability.capabilityType
                });
        }
    }
}
