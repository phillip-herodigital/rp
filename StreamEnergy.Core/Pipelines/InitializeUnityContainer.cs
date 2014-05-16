using Sitecore;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace StreamEnergy.Pipelines
{
    public class InitializeUnityContainer
    {
        [UsedImplicitly]
        public virtual void Process(PipelineArgs args)
        {
            var configuration = GetConfiguration();
            SetupUnityContainer(configuration);
        }

        private Configuration.ConfigurationSection GetConfiguration()
        {
            var configuration = WebConfigurationManager.GetWebApplicationSection("streamEnergy") as Configuration.ConfigurationSection;

            if (configuration == null)
            {
                global::Sitecore.Diagnostics.Log.SingleError("Could not find \"streamEnergy\" configuration section.", this);
                throw new InvalidOperationException("Could not find \"streamEnergy\" configuration section.");
            }
            return configuration;
        }

        private static void SetupUnityContainer(Configuration.ConfigurationSection configuration)
        {
            StreamEnergy.Unity.Container.Instance.Initialize((from iocInitializer in configuration.InversionOfControlInitializers
                                                              let value = iocInitializer.Build()
                                                              where value != null
                                                              select value).ToArray());
        }

    }
}
