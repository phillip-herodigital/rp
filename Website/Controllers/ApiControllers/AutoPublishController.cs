using Sitecore.Data;
using Sitecore.Globalization;
using Sitecore.Publishing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class AutoPublishController : ApiController
    {
        private readonly ISettings settings;

        public AutoPublishController(ISettings settings)
        {
            this.settings = settings;
        }

        public void PerformSmartPublish(ISettings settings)
        {
            bool AutoPublishEnabled = !string.IsNullOrEmpty(settings.GetSettingsValue("AutoPublish", "AutoPublish"));
            if (AutoPublishEnabled)
            {

                Database dbSource = Sitecore.Configuration.Factory.GetDatabase("master");
                Database dbTarget = Sitecore.Configuration.Factory.GetDatabase("web");

                Language[] dbLanguages = dbSource.Languages;

                Database[] dbTargets = new Database[] { dbTarget };

                PublishManager.PublishSmart(dbSource, dbTargets, dbLanguages);
            }
        }
    }
}
