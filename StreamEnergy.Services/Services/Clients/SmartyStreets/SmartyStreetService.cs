﻿using System;
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
        private bool disabled;
        private readonly string authId;
        private readonly string authToken;
        private readonly IUnityContainer container;

        public SmartyStreetService([Dependency("SmartyStreets AuthId")] string authId, [Dependency("SmartyStreets AuthToken")] string authToken, IUnityContainer container)
        {
            this.authId = authId;
            this.authToken = authToken;
            this.container = container;
        }

        public async Task<IEnumerable<DomainModels.Address>> CleanseAddress(UncleansedAddress[] addresses)
        {
            if (disabled)
            {
                return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
            }

            var client = container.Resolve<HttpClient>();
            client.DefaultRequestHeaders.Add("x-standardize-only", "true");

            try
            {
                var response = await client.PostAsJsonAsync("https://api.smartystreets.com/street-address?auth-id=" + authId + "&auth-token=" + authToken, addresses).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    var result = ParseJsonResponse(await response.Content.ReadAsStringAsync().ConfigureAwait(false), addresses.Length);
                    return result.Select(addrs => addrs.SingleOrDefault()).ToArray();
                }
                else
                {
                    disabled = true;
                    return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
                }
            }
            catch
            {
                disabled = true;
                return Enumerable.Repeat<DomainModels.Address>(null, addresses.Length);
            }
        }

        public async Task<DomainModels.Address[][]> CleanseAddressOptions(DomainModels.Address[] addresses)
        {
            if (disabled)
            {
                return Enumerable.Repeat(new DomainModels.Address[0], addresses.Length).ToArray();
            }

            var client = container.Resolve<HttpClient>();

            var response = await client.PostAsJsonAsync("https://api.smartystreets.com/street-address?auth-id=" + authId + "&auth-token=" + authToken,
                from addr in addresses
                select new UncleansedAddress
                {
                    Street = addr.Line1,
                    Street2 = addr.Line2,
                    City = addr.City,
                    State = addr.StateAbbreviation,
                    Zipcode = addr.PostalCode5
                }).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                var result = ParseJsonResponse(await response.Content.ReadAsStringAsync().ConfigureAwait(false), addresses.Length);
                return result;
            }
            else
            {
                disabled = true;
                return Enumerable.Repeat(new DomainModels.Address[0], addresses.Length).ToArray();
            }
        }

        public static DomainModels.Address[][] ParseJsonResponse(string text, int count)
        {
            var result = JsonConvert.DeserializeObject<SmartyResponse[]>(text, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new UnderscoreMappingResolver()
            });

            return (from index in Enumerable.Range(0, count)
                    select (from entry in result
                            where entry.InputIndex == index
                            select Sanitize(new StreamEnergy.DomainModels.Address
                            {
                                Line1 = string.Join(" ", new string[] { entry.Components.PrimaryNumber, entry.Components.StreetName, entry.Components.StreetSuffix }.Where(e => !string.IsNullOrEmpty(e))),
                                UnitNumber = string.Join(" ", new string[] { entry.Components.SecondaryNumber, entry.Components.SecondaryDesignator }.Where(e => !string.IsNullOrEmpty(e))),
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