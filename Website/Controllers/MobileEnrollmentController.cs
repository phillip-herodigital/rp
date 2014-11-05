using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;
using StreamEnergy.DomainModels.MobileEnrollment;
using StreamEnergy.MyStream.Models.MobileEnrollment;

namespace StreamEnergy.MyStream.Controllers
{
    public class MobileEnrollmentController : Controller
    {
        /// <summary>
        /// Mobile Phones data to be accessible via Javascript
        /// </summary>
        /// <returns></returns>
        public ActionResult MobileEnrollmentPhones()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Mobile Enrollment");
            var mediaOptions = new Sitecore.Resources.Media.MediaUrlOptions();

            var data = item.Children.Select(child => new
            {
                Id = child.ID.ToString(),
                name = child.Fields["Name"].Value,
                brand = child.Fields["Brand"].Value,
                os = child.Fields["OS"].Value,
                imageUrl = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["ImageUrl"]).MediaItem, mediaOptions),
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

        public ActionResult BringYourOwnDevices()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Mobile BYO Devices");

            var data = item.Children.Select(child => new
            {
                Id = child.ID.ToString(),
                Make = child.Name,
                Models = child.Children.Select(obj => new
                {
                    ModelName = obj.Fields["Model"].Value,
                    Description = obj.Fields["Description"].Value
                })
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult MobileNetworks()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile Networks");
            var data = item.Children.Select(child => new
            {
                Id = child.ID.ToString(),
                Name = child.Fields["Network Name"].Value,
                Value = child.Fields["Network Value"].Value,
                Type = child.Fields["Network Type"].Value,
                StartingPrice = child.Fields["Starting Price"].Value
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult MobileDataPlans()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile Data Plans");
            var data = item.Children.Select(child => new
            {
                Name = child.Name.ToLower(),
                Plans = child.Children.Select(plans => new {
                    ID = plans.ID.ToString(),
                    data = plans.Fields["Data"].Value,
                    price = plans.Fields["Price"].Value,
                    fees = new {
                        salesUseTax = plans.Fields["Sales and Use Tax"].Value,
                        federalAccessCharge = plans.Fields["Federal Access Charge"].Value,
                        streamLineCharge = plans.Fields["Stream Line Charge"].Value
                    },
                    Recommended = plans.Fields["Recommended"].Value,
                    HoursMusic = plans.Fields["Hours Music"].Value,
                    HoursMovies = plans.Fields["Hours Movies"].Value,
                    HoursWebBrowsing = plans.Fields["Hours Web Browsing"].Value
                })
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        /*public ActionResult MobileEnrollmentNetworks()
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
        }*/

        public static IEnumerable<MobileColor> GetAllColors(NameValueCollection item) {
            var data = item.AllKeys.Select(key => new MobileColor { Value = key, Color = item[key] });
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
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile Networks");

            var data = item.Children.Select(child => new MobileNetwork
            {
                Name = child.Fields["Network Name"].Value,
                Value = child.Fields["Network Value"].Value,
                Description = child.Fields["Network Description"].Value,
                Coverage = child.Fields["Network Coverage"].Value,
                Device = child.Fields["Network Devices"].Value,
                StartingPrice = child.Fields["Starting Price"].Value
            });

            return View("~/Views/Components/Mobile Enrollment/Choose Network.cshtml", new ChooseNetwork
            {
                MobileNetworks = data
            });
        }

        public ActionResult ChoosePhone()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Mobile Enrollment");
            var mediaOptions = new Sitecore.Resources.Media.MediaUrlOptions();

            var data = item.Children.Select(child => new MobilePhone
            {
                Id = child.ID.ToString(),
                Name = child.Fields["Name"].Value,
                Brand = child.Fields["Brand"].Value,
                OS = child.Fields["OS"].Value,
                Description = child.Fields["Description"].Value,
                ImageUrlLarge = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["ImageUrl - Large"]).MediaItem, mediaOptions),
                Colors = GetAllColors(((Sitecore.Data.Fields.NameValueListField)child.Fields["Colors"]).NameValues).Select(obj => new MobileColor {
                    Color =  obj.Color,
                    Value =  obj.Value
                }),
                Models = GetAllPhoneModels(child.ID).Select(obj => new MobileModel
                {
                    Size = obj.Fields["Size"].Value,
                    Condition = obj.Fields["Condition"].Value,
                    Price = obj.Fields["Price"].Value
                })
            });

            return View("~/Views/Components/Mobile Enrollment/Choose Phone.cshtml", new ChoosePhone
            {
                MobilePhones = data
            });
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

        public ActionResult Cart()
        {
            return View("~/Views/Components/Mobile Enrollment/Cart.cshtml");
        }

        public ActionResult OrderSummary()
        {
            return View("~/Views/Components/Mobile Enrollment/Order Summary.cshtml");
        }

    }
}