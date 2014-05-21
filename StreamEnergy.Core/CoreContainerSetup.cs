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
            EnvironmentCategory environment;
            if (!Enum.TryParse<EnvironmentCategory>(Sitecore.Configuration.Settings.GetSetting("StreamEnergy.Environment"), out environment))
            {
                throw new InvalidOperationException("StreamEnergy.Environment is not set. It must be one of the following values: " + string.Join(", ", Enum.GetNames(typeof(EnvironmentCategory))));
            }
            unityContainer.RegisterInstance(environment);

            unityContainer.RegisterType<ISettings, SitecoreSettings>();

            var typeIndicatorJsonConverter = new TypeIndicatorJsonConverter();
            unityContainer.RegisterInstance(typeIndicatorJsonConverter);
            Json.AdditionalConverters.Add(typeIndicatorJsonConverter);
            unityContainer.RegisterInstance<IValidationService>(new ValidationService(unityContainer));
        }
    }
}
