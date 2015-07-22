using Sitecore.Configuration;
using Sitecore.Modules.EmailCampaign;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Pipelines
{
    public class EcmRenderer
    {
        public void Process(PipelineArgs args)
        {
            if (!string.IsNullOrEmpty(Settings.GetSetting("ECM.RendererUrl")))
            {
                GlobalSettings.RendererUrl = Settings.GetSetting("ECM.RendererUrl");
            }
        }
    }
}