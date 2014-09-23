using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SmartyStreets = StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.IndexGeneration.Aglc
{
    class Indexer : IIndexer
    {
        private readonly List<Action> onDispose = new List<Action>();


        public async Task AddAddresses(Options options, IndexBuilder indexBuilder, SmartyStreets.SmartyStreetService streetService)
        {
            
        }


        void IDisposable.Dispose()
        {
            foreach (var action in onDispose)
            {
                action();
            }
            onDispose.Clear();
        }
    }
}
