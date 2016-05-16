using Sitecore.Mvc.Presentation;
using StreamEnergy.DomainModels;
using StreamEnergy.Services.Clients;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.Models.Marketing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Mvc;
using StreamEnergy.DomainModels.Emails;
using Legacy = StreamEnergy.DomainModels.Accounts.Legacy;
using System.Threading.Tasks;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;
using Sitecore.Data;

namespace StreamEnergy.MyStream.Controllers
{
    public class MarketingController : Controller
    {
        private StreamEnergy.DomainModels.Accounts.IAccountService accountService;
        private IEmailService emailService;

        public MarketingController(IEmailService emailService, StreamEnergy.DomainModels.Accounts.IAccountService accountService)
        {
            this.emailService = emailService;
            this.accountService = accountService;
        }

        public ActionResult ContactIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Marketing.Contact()
            {
                ShowSuccessMessage = !string.IsNullOrEmpty(Request["success"]) && Request["success"] == "true",
            };

            return View("~/Views/Pages/Marketing/Contact/Contact.cshtml", model);
        }

        public ActionResult UsageCalculator()
        {
            
            var model = new StreamEnergy.MyStream.Models.Marketing.UsageCalculator()
            {
                ShowBillScrape = Request.QueryString["mode"] == "connect",
                ShowManualCalculator = Request.QueryString["manual"] == "true",
                IsModal      = GetValueFromCurrentRenderingParameters("IsModal") != null &&
                               GetValueFromCurrentRenderingParameters("IsModal").Length > 0 && 
                               Boolean.Parse(GetValueFromCurrentRenderingParameters("IsModal"))
            };

            return View("~/Views/Components/Marketing/Mobile/Mobile Usage Calculator.cshtml", model);
        }

        public ActionResult GetUsageCalculatorData()
        {
            Item mobileSettings = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Settings/Mobile Enrollment Options");
            Item dataPlansItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Mobile Data Plans");
            Item planRecommendationItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/Plan Recommendations/Plan Recommendations");
            MultilistField plans = planRecommendationItem.Fields["Individual Plans"];

            var dataPlans = dataPlansItem.Children.Where(child => child.Fields["Plan ID"] != null).Select(child => new
            {
                ID = child.ID.ToString(),
                PlanId = child.Fields["Plan ID"].Value,
                data = child.Fields["Data"].Value,
                price = child.Fields["Price"].Value,
                includesInternational = child.Fields["Includes International"].Value == "1" ? true : false,
                displayPlan = child.Fields["Display Plan"].Value == "1" ? true : false,
            });

            var recommendedPlans = new
            {
                Sprint = new
                {
                    Individual = new List<object>()
                }
            };

            foreach (ID id in plans.TargetIDs)
            {
                Item targetItem = Sitecore.Context.Database.Items[id];
                recommendedPlans.Sprint.Individual.Add(new
                {
                    ID = targetItem.ID.ToString(),
                    PlanId = targetItem.Fields["Plan ID"].Value,
                    data = targetItem.Fields["Data"].Value,
                    price = targetItem.Fields["Price"].Value
                });
            };

            List<object> carriers = new List<object>();
            carriers.Add(new
            {
                key = "att",
                name = planRecommendationItem.Fields["ATT"].Value,
                showLogin = !String.IsNullOrEmpty(planRecommendationItem.Fields["Show ATT Login"].Value),
                showRecommendations = true,
                fees = new
                {
                    ActivationFee = planRecommendationItem.Fields["ATT Activation Fee"].Value,
                    ExtraLineFee = planRecommendationItem.Fields["ATT Extra Line Fee"].Value
                },
                url = "http://www.att.com",
            });
            carriers.Add(new
            {
                key = "sprint",
                name = planRecommendationItem.Fields["Sprint"].Value,
                showLogin = !String.IsNullOrEmpty(planRecommendationItem.Fields["Show Sprint Login"].Value),
                showRecommendations = !String.IsNullOrEmpty(mobileSettings.Fields["Sprint Buy Phone"].Value) || !String.IsNullOrEmpty(mobileSettings.Fields["Sprint BYOD"].Value),
                fees = new
                {
                    ActivationFee = planRecommendationItem.Fields["ATT Activation Fee"].Value,
                    ExtraLineFee = planRecommendationItem.Fields["ATT Extra Line Fee"].Value
                },
                url = "http://www.sprint.com",
            });
            carriers.Add(new
            {
                key = "vzw",
                name = planRecommendationItem.Fields["Verizon"].Value,
                showLogin = !String.IsNullOrEmpty(planRecommendationItem.Fields["Show Verizon Login"].Value),
                url = "http://www.verizonwireless.com",
            });
            carriers.Add(new
            {
                key = "tmo",
                name = planRecommendationItem.Fields["TMobile"].Value,
                showLogin = !String.IsNullOrEmpty(planRecommendationItem.Fields["Show TMobile Login"].Value),
                url = "http://www.t-mobile.com",
            });

            var sliderValues = new List<string>();
            sliderValues.Add(planRecommendationItem.Fields["None"].Value);
            sliderValues.Add(planRecommendationItem.Fields["Some"].Value);
            sliderValues.Add(planRecommendationItem.Fields["Alot"].Value);

            var dataMultipliers = new
            {
                emails = planRecommendationItem.Fields["Emails"].Value,
                pictures = planRecommendationItem.Fields["Pictures"].Value,
                music = planRecommendationItem.Fields["Music"].Value,
                video = planRecommendationItem.Fields["Video"].Value,
                surfing = planRecommendationItem.Fields["Surfing"].Value
            };

            var data = new
            {
                dataPlans = dataPlans,
                recommendedPlans = recommendedPlans,
                carriers = carriers,
                sliderValues = sliderValues,
                dataMultipliers = dataMultipliers
            };

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        [HttpPost]
        [Mvc.ErrorSitecoreTranslation]
        public ActionResult ContactIndex(StreamEnergy.MyStream.Models.Marketing.Contact contact)
        {
            // Validate form data
            if (ModelState.IsValid)
            {
                // Get the form data
                var StreamService = contact.StreamService;
                var FirstName = contact.ContactName.First;
                var LastName = contact.ContactName.Last;
                var AddressLine1 = contact.AddressLine1;
                var City = contact.City;
                var StateAbbreviation = contact.StateAbbreviation;
                var PostalCode5 = contact.PostalCode5;
                var Phone = contact.ContactPhone != null ? contact.ContactPhone.Number : null;
                var Email = contact.ContactEmail.Address;
                var Reason = contact.Reason;
                var Comment = contact.Comment;
                var Name = FirstName + ' ' + LastName;

                // Get the To address(es) from Sitecore;
                var settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
                var ToEmail = settings.GetSettingsField("Marketing Form Email Addresses", "Contact Form Email Address").Value;
                var stateField = Sitecore.Context.Item.Fields[StateAbbreviation + " Email Address"];
                if (stateField != null && !string.IsNullOrEmpty(stateField.Value))
                {
                    ToEmail = stateField.Value;
                }

                // Send the email
                var fromAddress = Sitecore.Configuration.Settings.GetSetting("DynEtc.fromAddress", null);
                MailMessage Message = new MailMessage();
                Message.From = new MailAddress(fromAddress, Name);
                Message.ReplyToList.Add(new MailAddress(Email));
                Message.To.Add(ToEmail);
                Message.Subject = "New Contact Form Submission";
                Message.IsBodyHtml = true;
                Message.Body = "Stream Service This Is Regarding: " + StreamService +
                    "<br />First Name: " + FirstName +
                    "<br />Last Name: " + LastName +
                    "<br />Address: " + AddressLine1 +
                    "<br />" + City + ", " + StateAbbreviation + " " + PostalCode5 +
                    "<br />Phone: " + Phone +
                    "<br />Email: " + Email +
                    "<br />Reason: " + Reason +
                    "<br /> Comments: " + Comment;

                this.emailService.SendDynEmailSyncronous(Message);

                // Send the success message back to the page
                var ReturnURL = new RedirectResult(Request.Url.AbsolutePath + "?success=true##success-message");
                return ReturnURL;
            }
            else
            {
                return View("~/Views/Pages/Marketing/Contact/Contact.cshtml", contact);
            }
        }


        public ActionResult EnrollCommercialIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Marketing.CommercialQuote()
            {
                ShowSuccessMessage = !string.IsNullOrEmpty(Request["success"]) && Request["success"] == "true",
            };

            return View("~/Views/Pages/Marketing/Services/Enroll Commercial.cshtml", model);
        }

        [HttpPost]
        public ActionResult EnrollCommercialIndex(StreamEnergy.MyStream.Models.Marketing.CommercialQuote contact)
        {
            // Validate form data
            if (ModelState.IsValid)
            {
                // Get the form data
                var FirstName = contact.ContactName.First;
                var LastName = contact.ContactName.Last;
                var CompanyName = contact.CompanyName;
                var AddressLine1 = contact.ContactAddress.Line1;
                var City = contact.ContactAddress.City;
                var StateAbbreviation = contact.ContactAddress.StateAbbreviation;
                var PostalCode5 = contact.ContactAddress.PostalCode5;
                var Phone = contact.ContactPhone.Number;
                var Email = contact.ContactEmail.Address;
                var Name = FirstName + ' ' + LastName;
                var AgentId = "A2";
                try
                {
                    var plain = System.Text.Encoding.ASCII.GetString(Convert.FromBase64String(Request.QueryString["SPID"]));
                    var parts = plain.Split('|');
                    AgentId = parts[0];
                }
                catch (Exception) { };

                // Get the To address(es) from Sitecore;
                var settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
                var ToEmail = settings.GetSettingsField("Marketing Form Email Addresses", "Commercial Quote Email Address").Value;

                // Send the email
                var fromAddress = Sitecore.Configuration.Settings.GetSetting("DynEtc.fromAddress", null);
                MailMessage Message = new MailMessage();
                Message.From = new MailAddress(fromAddress, Name);
                Message.ReplyToList.Add(new MailAddress(Email));
                Message.To.Add(ToEmail);
                Message.Subject = "New Commerical Quote Request";
                Message.IsBodyHtml = true;
                Message.Body = "First Name: " + FirstName +
                    "<br />Last Name: " + LastName +
                    "<br />Company Name: " + CompanyName +
                    "<br />Address: " + AddressLine1 +
                    "<br />" + City + ", " + StateAbbreviation + " " + PostalCode5 +
                    "<br />Phone: " + Phone +
                    "<br />Email: " + Email +
                    "<br />Agent ID: " + AgentId;

                // Intentionally letting the Task go - this sends async to the user's request.
                this.emailService.SendDynEmailSyncronous(Message);

                // Send the success message back to the page
                var ReturnURL = new RedirectResult(Request.Url.AbsolutePath + "?success=true##success-message");
                return ReturnURL;
            }
            else
            {
                return View("~/Views/Pages/Marketing/Services/Enroll Commercial.cshtml", contact);
            }
        }
        
        
        // Currents Feedback Form
         public ActionResult CurrentsFeedbackIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Currents.CurrentsFeedback()
            {
                ShowSuccessMessage = !string.IsNullOrEmpty(Request["success"]) && Request["success"] == "true",
            };

            return View("~/Views/Pages/Currents/CurrentsFeedback.cshtml", model);
        }

        [HttpPost]
        public ActionResult CurrentsFeedbackIndex(StreamEnergy.MyStream.Models.Currents.CurrentsFeedback contact)
        {
            // Validate form data
            if (ModelState.IsValid)
            {
                // Get the form data
                var FirstName = contact.ContactName.First;
                var LastName = contact.ContactName.Last;
                var Email = contact.ContactEmail.Address;
                var Phone = contact.ContactPhone.Number ;
                var Comments = contact.ContactComments;
                var Name = FirstName + ' ' + LastName;

                // Get the To address(es) from Sitecore;
                var settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
                var ToEmail = settings.GetSettingsField("Marketing Form Email Addresses", "Currents Feedback Email Address").Value;

                // Send the email
                var fromAddress = Sitecore.Configuration.Settings.GetSetting("DynEtc.fromAddress", null);
                MailMessage Message = new MailMessage();
                Message.From = new MailAddress(fromAddress, Name);
                Message.ReplyToList.Add(new MailAddress(Email));
                Message.To.Add(ToEmail);
                Message.Subject = "New Currents Comments/Feedback";
                Message.IsBodyHtml = true;
                Message.Body = "First Name: " + FirstName +
                    "<br />Last Name: " + LastName +
                    "<br />Email: " + Email +
                    "<br />Phone: " + Phone +
                    "<br />Comments: " + Comments ;
                    

                // Intentionally letting the Task go - this sends async to the user's request.
                this.emailService.SendDynEmailSyncronous(Message);

                // Send the success message back to the page
                var ReturnURL = new RedirectResult(Request.Url.AbsolutePath + "?success=true##success-message");
                return ReturnURL;
            }
            else
            {
                return View("~/Views/Pages/Currents/CurrentsFeedback.cshtml", contact);
            }
        }



        // Return Form
        public ActionResult ReturnFormIndex()
        {
            var model = new StreamEnergy.MyStream.Models.ReturnForm()
            {
                ShowSuccessMessage = !string.IsNullOrEmpty(Request["success"]) && Request["success"] == "true",
            };

            return View("~/Views/Pages/Marketing/Return/Return Form.cshtml", model);
        }

        [HttpPost]
        public ActionResult ReturnFormIndex(StreamEnergy.MyStream.Models.ReturnForm contact)
        {
            // Validate form data
            if (ModelState.IsValid)
            {
                // Get the form data
                var FirstName = contact.ContactName.First;
                var LastName = contact.ContactName.Last;
                var Email = contact.ContactEmail.Address;
                var Phone = (contact.ContactPhone == null) ? "" : contact.ContactPhone.Number;
                var OrderNumber = contact.OrderNumber;
                var LastFour = contact.LastFour;
                var EnergyServices = contact.EnergyServices;
                var MobileServies = contact.MobileServices;
                var HomeServices = contact.HomeServices;
                var IMEI = contact.IMEINumber;
                var Reason = contact.ReturnReason;
                var Comments = contact.ContactComments;
                var Name = FirstName + ' ' + LastName;

                var ServicesString = EnergyServices ? " Energy Services" : "";
                if (MobileServies) {ServicesString += " Mobile Services"; }
                if (HomeServices) { ServicesString += " Home Services"; }

                // Get the To address(es) from Sitecore;
                var settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
                var EnergyEmail = settings.GetSettingsField("Marketing Form Email Addresses", "Energy Return Email Address").Value;
                var MobileEmail = settings.GetSettingsField("Marketing Form Email Addresses", "Mobile Return Email Address").Value;
                var HomeEmail = settings.GetSettingsField("Marketing Form Email Addresses", "Home Return Email Address").Value;

                // Send the email
                var fromAddress = Sitecore.Configuration.Settings.GetSetting("DynEtc.fromAddress", null);
                MailMessage Message = new MailMessage();
                Message.From = new MailAddress(fromAddress, Name);
                Message.ReplyToList.Add(new MailAddress(Email));
                if (EnergyServices) { Message.To.Add(EnergyEmail); }
                if (MobileServies) { Message.To.Add(MobileEmail); }
                if (HomeServices) { Message.To.Add(HomeEmail); }
                Message.Subject = "IGNITION RETURN: My Stream Store";
                Message.IsBodyHtml = true;
                Message.Body = "First Name: " + FirstName +
                    "<br />Last Name: " + LastName +
                    "<br />Email: " + Email +
                    "<br />Phone: " + Phone +
                    "<br />Order Number: " + OrderNumber +
                    "<br />Last 4 of CC: " + OrderNumber +
                    "<br />Service Categories: " + ServicesString +
                    "<br />IMEI/MEID: " + IMEI +
                    "<br />Reason: " + Reason +
                    "<br />Comments: " + Comments;


                // Intentionally letting the Task go - this sends async to the user's request.
                this.emailService.SendDynEmailSyncronous(Message);

                // Send the success message back to the page
                var ReturnURL = new RedirectResult(Request.Url.AbsolutePath + "?success=true##success-message");
                return ReturnURL;
            }
            else
            {
                return View("~/Views/Pages/Marketing/Return/Return Form.cshtml", contact);
            }
        }
        

        
        
        public ActionResult HomeLifeServices(string hash, string mock)
        {
            HomeLifeServices model = new HomeLifeServices()
            {
                HasFreeMonth = false,
                ClientId = "1052614",
                SaleSource = "MyStream",
            };

            if (!string.IsNullOrEmpty(hash))
            {
                var hashValues = new Dictionary<string, string>();
                var parts = Encoding.UTF8.GetString(Convert.FromBase64String(hash)).Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    var pair = part.Split(new string[] { "=" }, StringSplitOptions.RemoveEmptyEntries);
                    if (pair.Length == 2)
                    {
                        hashValues[pair[0].ToLower()] = pair[1];
                    }
                }

                Legacy.CustomerAccount customerAccount = null;

                try
                {
                    if (hashValues.ContainsKey("refsite"))
                    {
                        model.SaleSource = hashValues["refsite"];

                        if (hashValues["refsite"] == "PowerCenter")
                        {
                            customerAccount = accountService.RetrieveIgniteAssociateContactInfo("Ignite", "3t8sh8f3sg", hashValues["igniteassociate"]);
                            //model.HasFreeMonth = true;
                        }
                        else if (new string[] { "MyStreamEnroll", "MyIgniteEnroll" }.Contains(hashValues["refsite"]))
                        {
                            customerAccount = accountService.GetCisAccountsByUtilityAccountNumber(hashValues["camelotaccountnumber"], hashValues.ContainsKey("last4ssn") ? hashValues["last4ssn"] : null, "");
                            //model.HasFreeMonth = true;
                        }
                        else if (new string[] { "MyStreamRenew", "MyIgniteRenew", "IstaNetEnroll", "NEWelcomeEmail", "KubraMyAccount" }.Contains(hashValues["refsite"]))
                        {
                            customerAccount = accountService.GetCisAccountsByCisAccountNumber(hashValues["ciscustomernumber"], hashValues.ContainsKey("last4ssn") ? hashValues["last4ssn"] : null, "");
                            //model.HasFreeMonth = true;
                        }
                        else if (new string[] { "MyIgnite" }.Contains(hashValues["refsite"]))
                        {
                            model.RepId = hashValues["igniteassociate"];
                        }
                    }
                }
                catch (Exception)
                {
                    // do nothing? Maybe log this?
                }

                if (customerAccount != null)
                {
                    model.CustomerAccount = customerAccount;
                    if (hashValues.ContainsKey("igniteassociate"))
                    {
                        model.RepId = hashValues["igniteassociate"];
                    }
                }

                try
                {
                    if (string.IsNullOrEmpty(model.RepId) && model.CustomerAccount != null && !string.IsNullOrEmpty(model.CustomerAccount.CamelotAccountNumber))
                    {
                        model.RepId = accountService.GetIgniteAssociateFromCustomerNumber("Ignite", "3t8sh8f3sg", model.CustomerAccount.CamelotAccountNumber);
                    }
                }
                catch (Exception) { }

                if (model.RepId == null && hashValues.ContainsKey("igniteassociate"))
                {
                    model.RepId = hashValues["igniteassociate"];
                }
            }

            return View("~/Views/Pages/Marketing/Services/HomeLife Services.cshtml", model);
        }

        public static string GetValueFromCurrentRenderingParameters(string parameterName)
        {
            var rc = RenderingContext.CurrentOrNull;
            if (rc == null || rc.Rendering == null) return (string)null;
            var parametersAsString = rc.Rendering.Properties["Parameters"];
            var parameters = HttpUtility.ParseQueryString(parametersAsString);
            return parameters[parameterName];
        }

        public ActionResult SimActivation()
        {
            return View("~/Views/Components/Marketing/Mobile/Mobile SIM Activation.cshtml");
        }
    }
}
