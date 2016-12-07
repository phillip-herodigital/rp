using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using StreamEnergy.Interpreters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    [ChildActionOnly]
    public class DataController : Controller
    {
        private readonly ISettings settings;
        private IDpiEnrollmentParameters enrollmentParameters;

        public DataController(ISettings settings, IDpiEnrollmentParameters enrollmentParameters)
        {
            this.settings = settings;
            this.enrollmentParameters = enrollmentParameters;
        }

        public ActionResult States()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/State Abbreviations/State Abbreviations");
            var nameValues = ((Sitecore.Data.Fields.NameValueListField)item.Fields["State Abbreviations"]).NameValues;

            var data = nameValues.AllKeys.Select(key => new { abbreviation = key, display = nameValues[key] });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult StateNames()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/State Names/State Names");
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

        public ActionResult MobileEnrollmentSettings()
        {
            var item = settings.GetSettingsItem("Mobile Enrollment Options");

            var data =  new
            {
                sprintBuyPhone = !string.IsNullOrEmpty(item.Fields["Sprint Buy Phone"].Value) || Request.QueryString["SprintBuyPhone"] == "true",
                sprintBuyPhoneWsa = !string.IsNullOrEmpty(item.Fields["Sprint Buy Phone WSA"].Value) || Request.QueryString["SprintBuyPhoneWsa"] == "true",
                sprintByod = !string.IsNullOrEmpty(item.Fields["Sprint BYOD"].Value) || Request.QueryString["SprintByod"] == "true",
                attBuyPhone = !string.IsNullOrEmpty(item.Fields["ATT Buy Phone"].Value) || Request.QueryString["AttBuyPhone"] == "true",
                attBuyPhoneWsa = !string.IsNullOrEmpty(item.Fields["ATT Buy Phone WSA"].Value) || Request.QueryString["AttBuyPhoneWsa"] == "true",
                validateSprintEsn = !string.IsNullOrEmpty(item.Fields["Validate Sprint ESN"].Value),
                excludedStates = item.Fields["Excluded States"].Value.Split(','),
                disableSharedPlans = !string.IsNullOrEmpty(item.Fields["Disable Shared Plans"].Value),
                disableMobileEnrollments = !string.IsNullOrEmpty(item.Fields["Disable Mobile Enrollments"].Value) && Request.QueryString["SecretAccess"] != "true",
                disableIntegratedEnrollments = !string.IsNullOrEmpty(item.Fields["Disable Integrated Enrollments"].Value) && Request.QueryString["IntegratedEnrollment"] != "true",
                disableInstallmentPlans = !string.IsNullOrEmpty(item.Fields["Disable Installment Plans"].Value) && Request.QueryString["InstallmentPlans"] != "true",
                reCaptchaPublicKey = item.Fields["reCaptcha Public Key"].Value,
                autoPayDiscount = item.Fields["AutoPay Discount"].Value,
                allowAddDevice = !string.IsNullOrEmpty(item.Fields["Allow Add Device"].Value),
            };

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult ProtectiveEnrollmentSettings()
        {
            var item = settings.GetSettingsItem("Protective Enrollment Options");
            var data = new
            {
                KIQFailOption = !string.IsNullOrEmpty(item.Fields["KIQ Fail Option"].Value),
            };

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult SimActivationSettings()
        {
            var item = settings.GetSettingsItem("SIM Activation Options");

            var weekdayStartTime = item.Fields["Weekday Start Time"].Value;
            var weekdayEndTime = item.Fields["Weekday End Time"].Value;
            var saturdayStartTime = item.Fields["Saturday Start Time"].Value;
            var saturdayEndTime = item.Fields["Saturday End Time"].Value;
            var sundayStartTime = item.Fields["Sunday Start Time"].Value;
            var sundayEndTime = item.Fields["Sunday End Time"].Value;

            bool canActivate = true;

            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);
            var dayOfWeek = cstTime.DayOfWeek;
            var currentTime = cstTime.TimeOfDay;

            if (dayOfWeek == DayOfWeek.Saturday)
            {
                if (!string.IsNullOrEmpty(saturdayStartTime) && (currentTime < TimeSpan.Parse(saturdayStartTime) || currentTime > TimeSpan.Parse(saturdayEndTime)))
                    canActivate = false;
            }
            else if (dayOfWeek == DayOfWeek.Sunday)
            {
                if (!string.IsNullOrEmpty(sundayStartTime) && (currentTime < TimeSpan.Parse(sundayStartTime) || currentTime > TimeSpan.Parse(sundayEndTime)))
                    canActivate = false;
            }
            else
            {
                if (!string.IsNullOrEmpty(weekdayStartTime) && (currentTime < TimeSpan.Parse(weekdayStartTime) || currentTime > TimeSpan.Parse(weekdayEndTime)))
                    canActivate = false;
            }

            var data = new
            {
                activationAvailable = canActivate,
            };

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult EventCategories()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Currents/Event Categories");
            var data = item.Children.Select(child => new { name = child.Name.ToLower(), display = child.Fields["Category Name"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult AssociateLevels()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Associate Levels/Associate Levels");
            var nameValues = ((Sitecore.Data.Fields.NameValueListField)item.Fields["Associate Levels"]).NameValues;
            var data = nameValues.AllKeys.Select(key => new { abbreviation = key, display = nameValues[key] });
            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult DigitalVoiceSettings()
        {
            var item = settings.GetSettingsItem("Digital Voice");

            var data = new
            {
                hubUrl = item.Fields["Hub URL"].Value,
                airUrl = item.Fields["Bundle Air URL"].Value,
                bridgeUrl = item.Fields["Bundle Bridge URL"].Value,
                referralParameters = enrollmentParameters.ToStreamConnectSalesInfo(),
            };

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult GetProtectiveServices()
        {
            int sortOrder = 0;
            float price = 0;
            float discount = 0;
            var data = (from service in Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Products/Protective/Services").Children
                        let iconField = new ImageField(service.Fields["Icon"])
                        select new DomainModels.Enrollments.Protective.Service
                        {
                            Id = service.Fields["ID"].Value,
                            Name = service.Fields["Name"].Value,
                            Guid = service.ID.ToString(),
                            ExcludedStates = (from Abbreviation in service.Fields["Excluded States"].Value.Split(',')
                                              select Abbreviation.Trim()).ToArray(),
                            VideoConferenceStates = (from Abbreviation in service.Fields["Video Conference States"].Value.Split(',')
                                                     select Abbreviation.Trim()).ToArray(),
                            Description = service.Fields["Description"].Value,
                            Details = service.Fields["Details"].Value.Split('|'),
                            SortOrder = int.TryParse(service.Fields["Sort Order"].Value, out sortOrder) ? sortOrder : -1,
                            Price = float.TryParse(service.Fields["Price"].Value, out price) ? price : -1,
                            ThreeServiceDiscount = float.TryParse(service.Fields["Three Service Discount"].Value, out discount) ? discount : -1,
                            HasGroupOffer = service.Fields["Has Group Offer"].Value == "1",
                            IsGroupOffer = service.Fields["Is Group Offer"].Value == "1",
                            AssociatedOfferId = service.Fields["Associated Offer ID"].Value,
                            IconURL = iconField.MediaItem != null ? Sitecore.Resources.Media.MediaManager.GetMediaUrl(iconField.MediaItem) : ""
                        }).ToArray();

            return this.Content(StreamEnergy.Json.Stringify(data));
        }
    }
}