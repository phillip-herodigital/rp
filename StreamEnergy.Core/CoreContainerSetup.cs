using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    class CoreContainerSetup : IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            var typeIndicatorJsonConverter = new TypeIndicatorJsonConverter();
            unityContainer.RegisterInstance(typeIndicatorJsonConverter);
            Json.AdditionalConverters.Add(typeIndicatorJsonConverter);
            unityContainer.RegisterInstance<IValidationService>(new ValidationService(unityContainer));
        }
    }
}
