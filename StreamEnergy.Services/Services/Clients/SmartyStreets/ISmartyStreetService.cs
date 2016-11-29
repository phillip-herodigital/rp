using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public interface ISmartyStreetService
    {
        Task<IEnumerable<StreamCommons.Account.Address>> CleanseAddress(UncleansedAddress[] addresses);

        Task<IEnumerable<string>> AddressTypeAhead(string input, string stateAbbreviation);

        Task<AddressLookupResponse> StreetAddressLookup(string input);

        Task<DomainModels.Address[][]> CleanseAddressOptions(DomainModels.Address[] addresses);

        Task<String[]> LookupZip(string postalCode5);
    }
}
