using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
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
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Phone Models");
            var mediaOptions = new Sitecore.Resources.Media.MediaUrlOptions();

            var data = item.Children.Select(child => new
            {
                Id = child.ID.ToString(),
                Name = child.Fields["Name"].Value,
                Brand = child.Fields["Brand"].Value,
                Os = child.Fields["OS"].Value,
                ImageFront = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["Image - Front"]).MediaItem, mediaOptions),
                Colors = GetAllColors(((Sitecore.Data.Fields.NameValueListField)child.Fields["Colors"]).NameValues).Select(obj => new {
                    Color =  obj.Color,
                    Value =  obj.Value
                }),
                Networks = child.Fields["Networks"].Value.Split('|').ToArray(),
                Models = GetAllPhoneModels(child.ID).Select(obj => new
                {
                    Size = obj.Fields["Size"].Value,
                    Color = obj.Fields["Color"].Value,
                    ColorClass = (Char.ToLowerInvariant(obj.Fields["Color"].Value[0]) + obj.Fields["Color"].Value.Substring(1)).Trim(),
                    Network = obj.Fields["Network"].Value.ToLower(),
                    Condition = obj.Fields["Condition"].Value,
                    Sku = obj.Fields["SKU"].Value,
                    InStock = false,
                    InstallmentPlans = GetAllInstallmentPlans(obj).Select(plan => new
                    {
                        Months = plan.Fields["Number of Months"].Value,
                        AGroupSku = plan.Fields["A Group SKU"].Value,
                        BGroupSku = plan.Fields["B Group SKU"].Value,
                        CGroupSku = plan.Fields["C Group SKU"].Value,
                        InStock = false

                    })
                })
            });

            try
            {
                return this.Content(StreamEnergy.Json.Stringify(data.ToArray()));
            }
            catch
            {
                return this.Content("[]");
            }
        }

        public ActionResult BringYourOwnDevices()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile BYO Devices");

            var data = item.Children.Select(child => new
            {
                Id = child.ID.ToString(),
                Make = child.Name,
                Models = child.Children.Select(obj => new
                {
                    ModelName = obj.Fields["Model"].Value,
                    Description = obj.Fields["Description"].Value,
                    Lte = !string.IsNullOrEmpty(obj.Fields["LTE"].Value),
                })
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult PreviousServiceProviders()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Previous Service Providers");

            var data = item.Children.Select(child => new
            {
                Name = child.Name,
                Display = child.Fields["Display Text"].Value,
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult MobileNetworks()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Networks");
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
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Data Plans");
            var data = item.Children.Select(child => new
            {
                Name = child.Name.ToLower(),
                Plans = child.Children.Select(plans => new {
                    ID = plans.ID.ToString(),
                    PlanId = plans.Fields["Plan ID"].Value,
                    data = plans.Fields["Data"].Value,
                    price = plans.Fields["Price"].Value,
                    fees = new {
                        salesUseTax = plans.Fields["Sales and Use Tax"].Value,
                        federalAccessCharge = plans.Fields["Federal Access Charge"].Value,
                        streamLineCharge = plans.Fields["Stream Line Charge"].Value
                    },
                    DataDescription = plans.Fields["Data Description"].Value,
                    Recommended = plans.Fields["Recommended"].Value,
                    HoursMusic = plans.Fields["Hours Music"].Value,
                    HoursMovies = plans.Fields["Hours Movies"].Value,
                    HoursWebBrowsing = plans.Fields["Web Pages"].Value,
                    SpecialOffer = plans.Fields["Special Offer"].Value,
                    SpecialOfferText = plans.Fields["Special Offer Text"].Value,
                    SpecialOfferOriginalPrice = plans.Fields["Special Offer Original Price"].Value
                })
            });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

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
            Item[] allPhoneModels = Sitecore.Context.Database.SelectItems("fast:/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Pricing//*[(@@templateid='{151B1A5D-FE85-4FEF-8779-1D2E328391C9}')]");
            IEnumerable<Item> data = allPhoneModels.Where(item => item.Fields["Model"].Value != "").Where(item => new Sitecore.Data.ID(item.Fields["Model"].Value) == phoneID);
            return data;
        }

        public static IEnumerable<Item> GetAllInstallmentPlans(Item phoneItem)
        {
            IEnumerable<Item> data = phoneItem.Children;
            return data;
        }

        public ActionResult ChooseNetwork()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Networks");

            var data = item.Children.Select(child => new MobileNetwork
            {
                Name = child.Fields["Network Name"].Value,
                Value = child.Fields["Network Value"].Value,
                Description = child.Fields["Network Description"].Value,
                Coverage = child.Fields["Network Coverage"].Value,
                Device = child.Fields["Network Devices"].Value,
                StartingPrice = child.Fields["Starting Price"].Value,
                Header = child.Fields["Network Header"].Value,
                IndividualPlansResidential = child.Fields["Individual Plans - Residential"].Value,
                GroupPlansResidential = child.Fields["Group Plans - Residential"].Value,
                IndividualPlansCommercial = child.Fields["Individual Plans - Commercial"].Value,
                GroupPlansCommercial = child.Fields["Group Plans - Commercial"].Value
            });

            return View("~/Views/Components/Mobile Enrollment/Choose Network.cshtml", new ChooseNetwork
            {
                MobileNetworks = data
            });
        }

        public ActionResult ChoosePhone()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Phone Models");
            var mediaOptions = new Sitecore.Resources.Media.MediaUrlOptions();

            var data = item.Children.Select(child => new MobilePhone
            {
                Id = child.ID.ToString(),
                Name = child.Fields["Name"].Value,
                Brand = child.Fields["Brand"].Value,
                OS = child.Fields["OS"].Value,
                Description = child.Fields["Description"].Value,
                LongDescription = child.Fields["Description - More Details"].Value,
                ImageFront = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["Image - Front"]).MediaItem, mediaOptions),
                ImageBack = Sitecore.Resources.Media.MediaManager.GetMediaUrl(((Sitecore.Data.Fields.ImageField)child.Fields["Image - Back"]).MediaItem, mediaOptions),
                Colors = GetAllColors(((Sitecore.Data.Fields.NameValueListField)child.Fields["Colors"]).NameValues).Select(obj => new MobileColor {
                    Color =  obj.Color,
                    Value =  obj.Value
                }),
                Models = GetAllPhoneModels(child.ID).Select(obj => new MobileModel
                {
                    Size = obj.Fields["Size"].Value,
                    Color = obj.Fields["Color"].Value,
                    Network = obj.Fields["Network"].Value.ToLower(),
                    Condition = obj.Fields["Condition"].Value,
                    Price = obj.Fields["Price New"].Value,
                    Lease20 = obj.Fields["20 Mo Lease Price"].Value,
                    Lease24 = obj.Fields["24 Mo Lease Price"].Value,
                    Sku = obj.Fields["SKU"].Value
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