using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using ResponsivePath.Logging;
using Sitecore.Data.Items;

namespace StreamEnergy.Logging
{
    class SitecoreLogConfiguration : ResponsivePath.Logging.ILogConfiguration
    {
        private readonly IList<IDataAccumulator> accumulators;
        private readonly IList<ILogIndexer> indexers;
        private readonly IList<ILogRecorder> recorders;

        public SitecoreLogConfiguration()
        {
            accumulators = new List<IDataAccumulator>();
            indexers = new List<ILogIndexer>();
            recorders = new List<ILogRecorder>();
        }

        public SitecoreLogConfiguration(ISettings settings, IUnityContainer container)
            : this()
        {
            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                Setup(settings, "logging/accumulators", accumulators, container);
                Setup(settings, "logging/indexers", indexers, container);
                Setup(settings, "logging/recorders", recorders, container);
            }
        }

        private static void Setup<T>(ISettings settings, string field, IList<T> items, IUnityContainer container)
        {
            var target = settings.GetSettingsItem(field);
            if (target != null)
            {
                foreach (Item child in target.Children)
                {
                    var type = Type.GetType(child["Type"]);
                    if (type == null)
                        continue;
                    var childContainer = container.CreateChildContainer();

                    childContainer.RegisterInstance<Item>("settings", child);
                    items.Add((T)childContainer.Resolve(type));
                }
            }
        }


        public IEnumerable<IDataAccumulator> Accumulators
        {
            get { return accumulators; }
        }

        public IEnumerable<ILogIndexer> Indexers
        {
            get { return indexers; }
        }

        public IEnumerable<ILogRecorder> Recorders
        {
            get { return recorders; }
        }


        public bool WaitForLogRecording
        {
            get { return false; }
        }
    }
}
