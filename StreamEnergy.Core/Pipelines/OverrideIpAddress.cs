using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Sitecore.Analytics;
using Sitecore.Analytics.Pipelines.StartTracking;

namespace StreamEnergy.Pipelines
{
    public class OverrideIpAddress
    {
        public void Process(StartTrackingArgs args)
        {
            if (Tracker.Current == null
              || Tracker.Current.Interaction.GeoData == null
              || Tracker.Current.Interaction.Ip == null)
            {
                return;
            }

            string ip = new IPAddress(Tracker.Current.Interaction.Ip).ToString();

            if (ip != "0.0.0.0" && ip != "127.0.0.1" && ip != "::1")
            {
                return;
            }

            string html = Sitecore.Web.WebUtil.ExecuteWebPage("http://wtfismyip.com/text");
            html = html.ToLowerInvariant().Replace("\n", "").Replace("\r", "");
            IPAddress address = IPAddress.Parse(html);

            Tracker.Current.Interaction.Ip = address.GetAddressBytes();
            //Tracker.Current.Interaction.UpdateGeoIpData();
            //var result = Tracker.Current.Interaction.UpdateGeoIpData(new TimeSpan(0, 0, 0, 0, 1000)); // Tracker.Visitor.DataContext.GetGeoIp(address.GetAddressBytes());
        }
    }
}
