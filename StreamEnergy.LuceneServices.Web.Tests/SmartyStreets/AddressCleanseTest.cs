using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net.Http;
using Newtonsoft.Json;
using StreamEnergy.Services.Clients.SmartyStreets;

namespace StreamEnergy.LuceneServices.Web.Tests.SmartyStreets
{
    /// <summary>
    /// Summary description for AddressCleanseTest
    /// </summary>
    [TestClass]
    public class AddressCleanseTest
    {
        [TestMethod]
        public void ReadResponse()
        {
            var response = "[{\"input_index\":1,\"candidate_index\":0,\"delivery_line_1\":\"3620 Huffines Blvd Apt 226\",\"last_line\":\"Carrollton TX 75010-6447\",\"delivery_point_barcode\":\"750106447510\",\"components\":{\"primary_number\":\"3620\",\"street_name\":\"Huffines\",\"street_suffix\":\"Blvd\",\"secondary_number\":\"226\",\"secondary_designator\":\"Apt\",\"city_name\":\"Carrollton\",\"state_abbreviation\":\"TX\",\"zipcode\":\"75010\",\"plus4_code\":\"6447\",\"delivery_point\":\"51\",\"delivery_point_check_digit\":\"0\"},\"metadata\":{\"record_type\":\"H\",\"zip_type\":\"Standard\",\"county_fips\":\"48121\",\"county_name\":\"Denton\",\"carrier_route\":\"R006\",\"congressional_district\":\"24\",\"rdi\":\"Residential\",\"elot_sequence\":\"0107\",\"elot_sort\":\"A\",\"latitude\":33.00932,\"longitude\":-96.94187,\"precision\":\"Zip9\",\"time_zone\":\"Central\",\"utc_offset\":-6.0,\"dst\":true},\"analysis\":{\"dpv_match_code\":\"Y\",\"dpv_footnotes\":\"AABB\",\"dpv_cmra\":\"N\",\"dpv_vacant\":\"N\",\"active\":\"Y\",\"footnotes\":\"B#N#\"}}]\n";
            var addr = new SmartyStreetService("", "", null).ParseJsonResponse(response, 3);

            Assert.AreEqual(0, addr[0].Length);
            Assert.AreEqual("3620 Huffines Blvd 226 Apt Carrollton, TX, 75010-6447", addr[1][0].ToSingleLine());
            Assert.AreEqual(0, addr[2].Length);
        }
    }
}
