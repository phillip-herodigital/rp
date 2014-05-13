using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Analytics.Lookups;
using MaxMind.GeoIP2;
using System.Configuration;

namespace StreamEnergy.Providers
{
    public class GeoProvider : Sitecore.Analytics.Lookups.MaxMindProvider
    {
        public override WhoIsInformation GetInformationByIp(string ip)
        {
            var whois = new WhoIsInformation();
            var dbLocations = ConfigurationManager.AppSettings["GeoIP2.DbLocation"];
            if (!string.IsNullOrEmpty(dbLocations))
            {
                var reader = new DatabaseReader(dbLocations);
                var omni = reader.Omni("128.101.101.101");

                Console.WriteLine(omni.Country.IsoCode); // 'US'
                Console.WriteLine(omni.Country.Name); // 'United States'

                Console.WriteLine(omni.MostSpecificSubdivision.Name); // 'Minnesota'
                Console.WriteLine(omni.MostSpecificSubdivision.IsoCode); // 'MN'

                Console.WriteLine(omni.City.Name); // 'Minneapolis'

                Console.WriteLine(omni.Postal.Code); // '55455'

                Console.WriteLine(omni.Location.Latitude); // 44.9733
                Console.WriteLine(omni.Location.Longitude); // -93.2323
            }
            return whois;
        }
    }
}
