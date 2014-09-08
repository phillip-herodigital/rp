﻿using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using ResponsivePath.Validation;
using System.ComponentModel.DataAnnotations;
using StreamEnergy.Logging;

namespace StreamEnergy
{
    public class CoreContainerSetup : IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<EnvironmentCategory>(new ContainerControlledLifetimeManager(), new InjectionFactory(c =>
            {
                EnvironmentCategory environment;
                if (!Enum.TryParse<EnvironmentCategory>(WebConfigurationManager.AppSettings["StreamEnergy.Environment"], out environment))
                {
                    throw new InvalidOperationException("StreamEnergy.Environment could not be set. It must be one of the following values: " + string.Join(", ", Enum.GetNames(typeof(EnvironmentCategory))));
                }
                return environment;
            }));

            unityContainer.RegisterType<ISettings, SitecoreSettings>();

            var typeIndicatorJsonConverter = new TypeIndicatorJsonConverter();
            unityContainer.RegisterInstance(typeIndicatorJsonConverter);
            Json.AdditionalConverters.Add(typeIndicatorJsonConverter);

            unityContainer.RegisterType<ILogger, Logger>();
            
            unityContainer.RegisterInstance<IValidationService>(new ValidationService());

            Factories.BuildValidationService = () => unityContainer.Resolve<IValidationService>();
            Factories.BuildValidationContext = (obj) => 
                {
                    var result = new ValidationContext(obj);
                    result.ServiceContainer.AddService(typeof(IUnityContainer), unityContainer);
                    return result;
                };
        }
    }
}
