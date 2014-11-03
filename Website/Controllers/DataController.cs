﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    [ChildActionOnly]
    public class DataController : Controller
    {

        public ActionResult States()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/State Abbreviations/State Abbreviations");
            var nameValues = ((Sitecore.Data.Fields.NameValueListField)item.Fields["State Abbreviations"]).NameValues;

            var data = nameValues.AllKeys.Select(key => new { abbreviation = key, display = nameValues[key] });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult PhoneCategories()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Phone Types");
            var data = item.Children.Select(child => new { name = child.Name, display = child.Fields["Display Text"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult PreviousProviders()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers");
            var data = item.Children.Select(child => new { name = child.Name, display = child.Fields["Display Text"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult PreviousProvidersGeorgia()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers Georgia");
            var data = item.Children.Select(child => new { name = child.Name, display = child.Fields["Display Text"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult UtilityProviders()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Utility Providers");

            var mediaOptions = new Sitecore.Resources.Media.MediaUrlOptions {MaxHeight = 68};

            var data = item.Children.Select(child => new { 
                name = child.Fields["Provider Name"].Value, 
                link = child.Fields["Invoices Link"].Value, 
                logo = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["Provider Logo"]).MediaItem, mediaOptions) 
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult BankCategories()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Bank Account Types");
            var data = item.Children.Select(child => new { name = child.Name, display = child.Fields["Display Text"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult GeorgiaProducts()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Products/Georgia");

            var data = item.Children.Select(child => new
            {
                code = child.Name,
                name = child.Fields["Product Name"].Value,
                description = child.Fields["Product Description"].Value
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

    }
}