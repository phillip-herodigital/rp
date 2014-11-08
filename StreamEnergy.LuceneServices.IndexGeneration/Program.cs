using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using SmartyStreets = StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    class Program
    {
        const int reportEvery = 2000;
        const int maxTasks = 5000;

        static void Main(string[] args)
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;
            var options = new Options();
            if (!CommandLine.Parser.Default.ParseArguments(args, options))
            {
                return;
            }

            var unityContainer = new UnityContainer();
            new CoreContainerSetup().SetupUnity(unityContainer);
            new StreamEnergy.Services.Clients.ClientContainerSetup().SetupUnity(unityContainer);
            unityContainer.RegisterType<ISettings, NullSettings>();

            using (var indexer = BuildIndexer(options.Region))
            using (var indexBuilder = new IndexBuilder(options.Destination, options.ForceCreate))
            {
                var streetService = unityContainer.Resolve<SmartyStreets.SmartyStreetService>();
                indexer.AddAddresses(options, indexBuilder, streetService).Wait();

                Console.WriteLine("Optimizing");
                indexBuilder.Optimize().Wait();
            }
        }

        private static IIndexer BuildIndexer(string region)
        {
            switch (region.ToLower())
            {
                case "aglc":
                    return new Aglc.Indexer(reportEvery, maxTasks);
                case "ercot":
                    return new Ercot.Indexer(reportEvery, maxTasks);
            }

            throw new NotSupportedException();
        }

    }
}
