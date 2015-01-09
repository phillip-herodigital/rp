using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StreamEnergy.StreamCommons.Account;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public interface ISmartyStreetService
    {
        Task<IEnumerable<Address>> CleanseAddress(UncleansedAddress[] addresses);

        Task<DomainModels.Address[][]> CleanseAddressOptions(DomainModels.Address[] addresses);

        Task<String[]> LookupZip(string postalCode5);
    }
}
