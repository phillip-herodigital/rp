using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace StreamEnergy.LuceneServices.IndexGeneration.SmartyStreets
{
    public class SmartyStreetService
    {
        private bool disabled;
        private readonly string authId;
        private readonly string authToken;

        public SmartyStreetService(string authId, string authToken)
        {
            this.authId = authId;
            this.authToken = authToken;
        }

        public async Task<IEnumerable<DomainModels.Address>> CleanseAddress(UncleansedAddress[] addresses)
        {
            if (disabled)
            {
                return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("x-standardize-only", "true");

            var response = await client.PostAsJsonAsync("https://api.smartystreets.com/street-address?auth-id=" + authId + "&auth-token=" + authToken, addresses).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                var result = ParseJsonResponse(await response.Content.ReadAsStringAsync().ConfigureAwait(false), addresses.Length);
                return result;
            }
            else
            {
                disabled = true;
                return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
            }
        }

        public static DomainModels.Address[] ParseJsonResponse(string text, int count)
        {
            var result = JsonConvert.DeserializeObject<SmartyResponse[]>(text, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new IndexGeneration.SmartyStreets.UnderscoreMappingResolver()
            });

            return (from index in Enumerable.Range(0, count)
                    let entry = result.SingleOrDefault(e => e.InputIndex == index)
                    select entry == null ? null : Sanitize(new StreamEnergy.DomainModels.Address
                    {
                        Line1 = string.Join(" ", new string[] { entry.Components.PrimaryNumber, entry.Components.StreetName, entry.Components.StreetSuffix }.Where(e => !string.IsNullOrEmpty(e))),
                        UnitNumber = string.Join(" ", new string[] { entry.Components.SecondaryNumber, entry.Components.SecondaryDesignator }.Where(e => !string.IsNullOrEmpty(e))),
                        City = entry.Components.CityName,
                        StateAbbreviation = entry.Components.StateAbbreviation,
                        PostalCode5 = entry.Components.Zipcode,
                        PostalCodePlus4 = entry.Components.Plus4Code,
                    })).ToArray();
        }

        private static DomainModels.Address Sanitize(DomainModels.Address address)
        {
            ((ISanitizable)address).Sanitize();
            return address;
        }
    }
}
