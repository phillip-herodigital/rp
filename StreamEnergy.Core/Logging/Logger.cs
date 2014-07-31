using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Sitecore.Data.Items;

namespace StreamEnergy.Logging
{
    class Logger : ILogger
    {
        public Logger()
        {
            Accumulators = new List<IDataAccumulator>();
            Indexers = new List<ILogIndexer>();
            Recorders = new List<ILogRecorder>();
        }

        public Logger(ISettings settings, IUnityContainer container)
            : this()
        {
            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                Setup(settings, "logging/accumulators", Accumulators, container);
                Setup(settings, "logging/indexers", Indexers, container);
                Setup(settings, "logging/recorders", Recorders, container);
            }
        }

        private static void Setup<T>(ISettings settings, string field, IList<T> items, IUnityContainer container)
        {
            foreach (Item child in settings.GetSettingsItem(field).Children)
            {
                var type = Type.GetType(child["Type"]);
                if (type == null)
                    continue;
                var childContainer = container.CreateChildContainer();

                childContainer.RegisterInstance<Item>("settings", child);
                items.Add((T)childContainer.Resolve(type));
            }
        }

        public async Task Record(LogEntry logEntry)
        {
            foreach (var accumulator in Accumulators)
            {
                try
                {
                    await accumulator.AccumulateData(logEntry);
                }
                catch { }
            }
            foreach (var indexer in Indexers)
            {
                try
                {
                    await indexer.IndexData(logEntry).ConfigureAwait(false);
                }
                catch { }
            }
            try
            {
                await Task.WhenAll(from recorder in Recorders
                                   select recorder.Save(logEntry));
            }
            catch { }
        }

        public IList<IDataAccumulator> Accumulators { get; private set; }

        public IList<ILogIndexer> Indexers { get; private set; }

        public IList<ILogRecorder> Recorders { get; private set; }
    }
}
