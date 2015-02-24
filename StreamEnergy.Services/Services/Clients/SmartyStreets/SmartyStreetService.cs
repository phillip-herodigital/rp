using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class SmartyStreetService : StreamEnergy.Services.Clients.SmartyStreets.ISmartyStreetService
    {
        private readonly string authId;
        private readonly string authToken;
        private readonly IUnityContainer container;
        private readonly JsonSerializerSettings settings;
        private readonly System.Net.Http.Formatting.MediaTypeFormatter jsonFormatter;

        public SmartyStreetService([Dependency("SmartyStreets AuthId")] string authId, [Dependency("SmartyStreets AuthToken")] string authToken, IUnityContainer container)
        {
            this.authId = authId;
            this.authToken = authToken;
            this.container = container;
            this.settings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new UnderscoreMappingResolver()
            };
            this.jsonFormatter = new StreamEnergy.Mvc.JsonNetFormatter(settings);
        }

        public async Task<IEnumerable<DomainModels.Address>> CleanseAddress(UncleansedAddress[] addresses)
        {
            var client = container.Resolve<HttpClient>();
            client.DefaultRequestHeaders.Add("x-standardize-only", "true");

            try
            {
                var response = await client.PostAsync("https://api.smartystreets.com/street-address?auth-id=" + authId + "&auth-token=" + authToken, addresses, jsonFormatter).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    var result = ParseJsonResponse(await response.Content.ReadAsStringAsync().ConfigureAwait(false), addresses.Length);
                    return result.Select(addrs => addrs.SingleOrDefault()).ToArray();
                }
                else
                {
                    return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
                }
            }
            catch
            {
                return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
            }
        }

        public async Task<DomainModels.Address[][]> CleanseAddressOptions(DomainModels.Address[] addresses)
        {
            var client = container.Resolve<HttpClient>();

            var response = await client.PostAsync("https://api.smartystreets.com/street-address?auth-id=" + authId + "&auth-token=" + authToken,
                from addr in addresses
                select new UncleansedAddress
                {
                    Street = addr.Line1,
                    Street2 = (addr.Line2 + " " + addr.UnitNumber).Trim(),
                    City = addr.City,
                    State = addr.StateAbbreviation,
                    Zipcode = addr.PostalCode5
                }, jsonFormatter).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                var result = ParseJsonResponse(await response.Content.ReadAsStringAsync().ConfigureAwait(false), addresses.Length);
                return result;
            }
            else
            {
                return Enumerable.Repeat(new DomainModels.Address[0], addresses.Length).ToArray();
            }
        }

        public async Task<String[]> LookupZip(string postalCode5)
        {
            var client = container.Resolve<HttpClient>();

            var response = await client.GetAsync("https://api.smartystreets.com/zipcode?auth-id=" + authId + "&auth-token=" + authToken + "&zipcode=" + postalCode5);

            if (response.IsSuccessStatusCode)
            {
                var result = JsonConvert.DeserializeObject<SmartyZipResponse[]>(await response.Content.ReadAsStringAsync().ConfigureAwait(false), settings);

                if (result[0].CityStates != null)
                {
                    var statesArray = (from entry in result
                                       where entry.InputIndex == 0
                                       select (from cityState in entry.CityStates
                                               select cityState.StateAbbreviation).Distinct()).First().ToArray();

                    return statesArray;
                }
                else
                {
                    return new string[0];
                }
                
            }
            else
            {
                return new string[0];
            }
        }

        public DomainModels.Address[][] ParseJsonResponse(string text, int count)
        {
            var result = JsonConvert.DeserializeObject<SmartyResponse[]>(text, settings);

            return (from index in Enumerable.Range(0, count)
                    select (from entry in result
                            where entry.InputIndex == index
                            select Sanitize(new StreamEnergy.DomainModels.Address
                            {
                                Line1 = string.Join(" ", new string[] { entry.Components.PrimaryNumber, entry.Components.StreetName, entry.Components.StreetSuffix }.Where(e => !string.IsNullOrEmpty(e))),
                                UnitNumber = string.Join(" ", new string[] { entry.Components.SecondaryDesignator, entry.Components.SecondaryNumber }.Where(e => !string.IsNullOrEmpty(e))),
                                City = entry.Components.CityName,
                                StateAbbreviation = entry.Components.StateAbbreviation,
                                PostalCode5 = entry.Components.Zipcode,
                                PostalCodePlus4 = entry.Components.Plus4Code,
                            })).ToArray()).ToArray();
        }

        private static DomainModels.Address Sanitize(DomainModels.Address address)
        {
            ((ISanitizable)address).Sanitize();
            return address;
        }

        Task<IEnumerable<StreamCommons.Account.Address>> ISmartyStreetService.CleanseAddress(UncleansedAddress[] addresses)
        {
            throw new NotImplementedException();
        }

    }
}
