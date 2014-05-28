using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore;
using Sitecore.Pipelines;

namespace StreamEnergy.MyStream.Pipelines
{
    public class SetupAddressTypeahead
    {
        [UsedImplicitly]
        public virtual void Process(PipelineArgs args)
        {
            StreamEnergy.LuceneServices.Web.App_Start.WebApiConfig.MapAddressLookupRoute(System.Web.Http.GlobalConfiguration.Configuration.Routes);
        }

    }
}