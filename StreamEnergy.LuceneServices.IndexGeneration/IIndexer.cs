using System;
using System.Threading.Tasks;
using SmartyStreets = StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    interface IIndexer : IDisposable
    {
        Task AddAddresses(Options options, IndexBuilder indexBuilder, SmartyStreets.SmartyStreetService streetService);
    }
}
