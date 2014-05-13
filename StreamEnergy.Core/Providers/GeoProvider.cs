using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Analytics.Lookups;
using MaxMind.GeoIP2;
using System.Configuration;
using System.Collections.Specialized;

namespace StreamEnergy.Providers
{
    public class GeoProvider : LookupProviderBase
    {
        public GeoProvider() : base()
        {
            
        }
        public override WhoIsInformation GetInformationByIp(string ip)
        {
            var whois = new WhoIsInformation();
            var dbLocations = Sitecore.Configuration.Settings.GetSetting("GeoIP2.DbLocation", null);
            if (!string.IsNullOrEmpty(dbLocations))
            {
                var reader = new DatabaseReader(System.Web.HttpContext.Current.Server.MapPath(dbLocations));
                var omni = reader.Omni(ip);
                //whois.AreaCode = "";
                whois.BusinessName = omni.Traits.Organization;
                whois.City = omni.City.Name;
                whois.Country = omni.Country.Name;
                //whois.Dns = "";
                whois.Isp = omni.Traits.Isp;
                whois.Latitude = omni.Location.Latitude.ToString();
                whois.Longitude = omni.Location.Longitude.ToString();
                whois.MetroCode = omni.Location.MetroCode.ToString();
                whois.PostalCode = omni.Postal.Code;
                whois.Region = omni.MostSpecificSubdivision.Name;
                whois.Url = omni.Traits.Domain;
            }
            return whois;
        }
    }
}
