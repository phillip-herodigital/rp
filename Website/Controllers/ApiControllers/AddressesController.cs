using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using StreamEnergy.DomainModels;
using StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/addresses")]
    public class AddressesController : ApiController
    {
        private readonly ISmartyStreetService service;

        public AddressesController(ISmartyStreetService service)
        {
            this.service = service;
        }

        [HttpPost]
        [Route("cleanse")]
        public async Task<Address[][]> Cleanse(Address[] addresses)
        {
            var results = await service.CleanseAddressOptions(addresses);

            results = (from entry in results.Zip(addresses, (cleansed, original) => new { cleansed, original })
                       select entry.cleansed.Except(new[] { entry.original }).ToArray()).ToArray();
            return results;
        }

        [HttpGet]
        [Route("lookupZip/{postalCode5}")]
        public async Task<String[]> LookupZip(string postalCode5)
        {
            return await service.LookupZip(postalCode5);
        }

    }
}