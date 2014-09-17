using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;
using StreamEnergy.MyStream.Models.MobileEnrollment;

namespace StreamEnergy.MyStream.Controllers
{
    public class MobileEnrollmentController : Controller
    {
        public ActionResult MobileEnrollmentPhones()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Mobile Enrollment");

            //var priceValues = ((Sitecore.Data.Fields.NameValueListField)item.Fields["Price and Condition"]).NameValues;
            //var prices = priceValues.AllKeys.Select(key => new { price = key, condition = Sitecore.Context.Database.GetItem(priceValues[key]) });
            var mediaOptions = new Sitecore.Resources.Media.MediaUrlOptions();

            var data = item.Children.Select(child => new
            {
                name = child.Fields["Name"].Value,
                imageUrl = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["ImageUrl"]).MediaItem, mediaOptions),
                //imageUrlLarge = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["ImageUrl - Large"]).MediaItem, mediaOptions),
                brand = child.Fields["Brand"].Value,
                os = child.Fields["OS"].Value,
                description = child.Fields["Description"].Value,
                colors = GetAllColors(((Sitecore.Data.Fields.NameValueListField)child.Fields["Colors"]).NameValues).Select(obj => new {
                    Color =  obj.Color,
                    Value =  obj.Value
                }),
                models = GetAllPhoneModels(child.ID).Select(obj => new
                {
                    Size = obj.Fields["Size"].Value,
                    Condition = obj.Fields["Condition"].Value,
                    Price = obj.Fields["Price"].Value
                })
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult MobileEnrollmentNetworks()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile Networks");
            var data = item.Children.Select(child => new
            {
                name = child.Fields["Network Name"].Value,
                value = child.Fields["Network Value"].Value,
                description = child.Fields["Network Description"].Value,
                coverage = child.Fields["Network Coverage"].Value,
                devices = child.Fields["Network Devices"].Value
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public static IEnumerable<MobilePrice> GetAllPrices(NameValueCollection item)
        {
            var data = item.AllKeys.Select(key => new MobilePrice { Value = key, Condition = GetConditionString(item[key]) });
            return data;
        }

        public static IEnumerable<MobileColor> GetAllColors(NameValueCollection item) {
            var data = item.AllKeys.Select(key => new MobileColor { Value = key, Color = item[key] });
            return data;
        }

        public static IEnumerable<MobileSize> GetAllSizes(NameValueCollection item) {
            var data = item.AllKeys.Select(key => new MobileSize { Value = key, Size = item[key] });
            return data;
        }

        public static string GetConditionString(string item)
        {
            var decodedItem = item.Replace("%7B", "{").Replace("%7D", "}");
            var siteCoreItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID(decodedItem));
            return siteCoreItem.Fields["Condition"].Value;
        }

        public static IEnumerable<Item> GetAllPhoneModels(Sitecore.Data.ID phoneID)
        {
            Item[] allPhoneModels = Sitecore.Context.Database.SelectItems("fast:/sitecore/content/Data/Taxonomy/Modules/Mobile Pricing//*[(@@templateid='{151B1A5D-FE85-4FEF-8779-1D2E328391C9}')]");
            IEnumerable<Item> data = allPhoneModels.Where(item => new Sitecore.Data.ID(item.Fields["Model"].Value) == phoneID);
            return data;
        }

        public ActionResult ChooseNetwork()
        {
            return View("~/Views/Components/Mobile Enrollment/Choose Network.cshtml");
        }

        public ActionResult ChoosePhone()
        {
            return View("~/Views/Components/Mobile Enrollment/Choose Phone.cshtml");
        }

        public ActionResult ConfigureData()
        {
            return View("~/Views/Components/Mobile Enrollment/Configure Data.cshtml");
        }

        public ActionResult CompleteOrder()
        {
            return View("~/Views/Components/Mobile Enrollment/Complete Order.cshtml");
        }

        public ActionResult OrderConfirmation()
        {
            return View("~/Views/Components/Mobile Enrollment/Order Confirmation.cshtml");
        }

    }
}