﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sitecore.Form.Core.Configuration;
using Sitecore.Data;
using Sitecore.Globalization;
using Sitecore.Publishing;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class AutoPublishController : Controller
    {
        private readonly ISettings settings;

        public AutoPublishController (ISettings settings)
        {
            this.settings = settings;
        }

        private void PerformSmartPublish(ISettings settings)
        {
            if (settings.get == true)
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