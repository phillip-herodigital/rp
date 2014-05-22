using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Pipelines
{
    public class UpdateGeoIpData : Sitecore.Analytics.Pipelines.CreateVisits.UpdateGeoIpData
    {
        public UpdateGeoIpData(): base()
        {

        }
        public override void Process(Sitecore.Analytics.Pipelines.CreateVisits.CreateVisitArgs args)
        {
            base.Process(args);
        }
    }
}
