using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net.Http;
using Newtonsoft.Json;
using StreamEnergy.LuceneServices.IndexGeneration.SmartyStreets;

namespace StreamEnergy.LuceneServices.Web.Tests.SmartyStreets
{
    /// <summary>
    /// Summary description for AddressCleanseTest
    /// </summary>
    [TestClass]
    public class AddressCleanseTest
    {
        [TestMethod]
        public void TestMethod1()
        {
            //HttpClient client = new HttpClient();
            //var response = client.PostAsJsonAsync("https://api.smartystreets.com/street-address?auth-id=c0183e05-c426-4f72-8fb8-7f5b912bb8e5&auth-token=8KsO2jTmPR5fIWNE5R48", new[] 
            //{
            //    new 
            //    {
            //        street = "3620 huffines blvd #226 carrollton texas 75010"
            //    }
            //}).Result;
            //var text = response.Content.ReadAsStringAsync().Result;
        }

        [TestMethod]
        public void ReadResponse()
        {
            var response = "[{\"input_index\":1,\"candidate_index\":0,\"delivery_line_1\":\"3620 Huffines Blvd Apt 226\",\"last_line\":\"Carrollton TX 75010-6447\",\"delivery_point_barcode\":\"750106447510\",\"components\":{\"primary_number\":\"3620\",\"street_name\":\"Huffines\",\"street_suffix\":\"Blvd\",\"secondary_number\":\"226\",\"secondary_designator\":\"Apt\",\"city_name\":\"Carrollton\",\"state_abbreviation\":\"TX\",\"zipcode\":\"75010\",\"plus4_code\":\"6447\",\"delivery_point\":\"51\",\"delivery_point_check_digit\":\"0\"},\"metadata\":{\"record_type\":\"H\",\"zip_type\":\"Standard\",\"county_fips\":\"48121\",\"county_name\":\"Denton\",\"carrier_route\":\"R006\",\"congressional_district\":\"24\",\"rdi\":\"Residential\",\"elot_sequence\":\"0107\",\"elot_sort\":\"A\",\"latitude\":33.00932,\"longitude\":-96.94187,\"precision\":\"Zip9\",\"time_zone\":\"Central\",\"utc_offset\":-6.0,\"dst\":true},\"analysis\":{\"dpv_match_code\":\"Y\",\"dpv_footnotes\":\"AABB\",\"dpv_cmra\":\"N\",\"dpv_vacant\":\"N\",\"active\":\"Y\",\"footnotes\":\"B#N#\"}}]\n";
            var addr = SmartyStreetService.ParseJsonResponse(response, 3);

            Assert.IsNull(addr[0]);
            Assert.AreEqual("3620 Huffines Blvd 226 Apt Carrollton, TX, 75010-6447", addr[1].ToSingleLine());
            Assert.IsNull(addr[2]);
        }
    }
}
