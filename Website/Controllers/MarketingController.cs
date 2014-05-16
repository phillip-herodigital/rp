using StreamEnergy.DomainModels;
using StreamEnergy.Services.Clients;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.Models.Marketing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Mvc;

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

        [HttpPost]
        public ActionResult ContactIndex(FormCollection collection)
        {
            try
            {
                var FirstName = collection["firstName"];
                var LastName = collection["lastName"];
                var AddressLine1 = collection["address"];
                var City = collection["city"];
                var StateAbbreviation = collection["state"];
                var PostalCode5 = collection["zipCode"];
                var Phone = collection["phone"];
                var Email = collection["email"];
                var Reason = collection["reason"];
                var Comments = collection["comments"];
                var Name = FirstName + ' ' + LastName;

                // TODO - Validate form data

                // Send the email
                MailAddress From = new MailAddress(Email, Name);
                MailAddress To = new MailAddress("adam.powell@responsivepath.com", "Adam Powell");  // TODO - Get this email address(es) from a Sitecore field
                MailMessage Message = new MailMessage(From, To);
                Message.Subject = "New Contact Form Submission";
                Message.IsBodyHtml = true;
                Message.Body = "First Name: " + FirstName + 
                    "<br />Last Name: " + LastName + 
                    "<br />Address: " + AddressLine1 +
                    "<br />" + City + ", " + StateAbbreviation + " " + PostalCode5 +
                    "<br />Phone: " + Phone + 
                    "<br />Email: " + Email + 
                    "<br />Reason: " + Reason +
                    "<br /> Comments: " + Comments;

                this.emailService.SendEmail(Message);
                
                // Send the success message back to the page
                return new RedirectResult(Request.Url.AbsolutePath + "?success=true#success-message");
            }
            catch
            {
                return View("~/Views/Pages/Marketing/Contact/Contact.cshtml");
            }
        }

        public ActionResult EnrollCommercialIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Marketing.Contact()
            {
                ShowSuccessMessage = !string.IsNullOrEmpty(Request["success"]) && Request["success"] == "true",
            };

            return View("~/Views/Pages/Marketing/Services/Enroll Commercial.cshtml", model);
        }

        [HttpPost]
        public ActionResult EnrollCommercialIndex(FormCollection collection)
        {
            try
            {
                var FirstName = collection["firstName"];
                var LastName = collection["lastName"];
                var CompanyName = collection["companyName"];
                var AddressLine1 = collection["address"];
                var City = collection["city"];
                var StateAbbreviation = collection["state"];
                var PostalCode5 = collection["zipCode"];
                var Phone = collection["phone"];
                var Email = collection["email"];
                var Name = FirstName + ' ' + LastName;

                // TODO - Validate form data

                // Send the email
                MailAddress From = new MailAddress(Email, Name);
                MailAddress To = new MailAddress("adam.powell@responsivepath.com", "Adam Powell"); // TODO - Get this email address(es) from a Sitecore field
                MailMessage Message = new MailMessage(From, To);
                Message.Subject = "New Commerical Quote Request";
                Message.IsBodyHtml = true;
                Message.Body = "First Name: " + FirstName + 
                    "<br />Last Name: " + LastName + 
                    "<br />Company Name: " + CompanyName + 
                    "<br />Address: " + AddressLine1 + 
                    "<br />" + City + ", " + StateAbbreviation + " " + PostalCode5 +
                    "<br />Phone: " + Phone + 
                    "<br />Email: " + Email;

                this.emailService.SendEmail(Message);

                // Send the success message back to the page
                return new RedirectResult(Request.Url.AbsolutePath + "?success=true#success-message");
            }
            catch
            {
                return View("~/Views/Pages/Marketing/Services/Enroll Commercial.cshtml");
            }
        }
        public ActionResult HomeLifeServices(string hash, string mock)
        {
            HomeLifeServices model = new HomeLifeServices();

            // how do we know if we are in production?
            model.PostUrl = "https://streamvalues.com.st1.ocenture.com/buy";

            if (!string.IsNullOrEmpty(hash))
            {
                var hashValues = new Dictionary<string, string>();
                var parts = Encoding.UTF8.GetString(Convert.FromBase64String(hash)).Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    var pair = part.Split(new string[] { "=" }, StringSplitOptions.RemoveEmptyEntries);
                    if (pair.Length == 2)
                    {
                        hashValues[pair[0]] = pair[1];
                    }
                }

                CustomerAccount customerAccount = null;

                try
                {
                    if (hashValues["RefSite"] == "PowerCenter")
                    {
                        customerAccount = accountService.RetrieveIgniteAssociateContactInfo("Ignite", "3t8sh8f3sg", hashValues["IgniteAssociate"]);
                    }
                    else if (new string[] { "MyStreamEnroll", "MyIgniteEnroll" }.Contains(hashValues["RefSite"]))
                    {
                        customerAccount = accountService.GetCisAccountsByUtilityAccountNumber(hashValues["CamelotAccountNumber"], hashValues["Last4Ssn"], "");
                    }
                    else if (new string[] { "MyStreamRenew", "MyIgniteRenew", "IstaNetEnroll", "NEWelcomeEmail", "KubraMyAccount" }.Contains(hashValues["RefSite"]))
                    {
                        customerAccount = accountService.GetCisAccountsByCisAccountNumber(hashValues["CISCustomerNumber"], hashValues["Last4Ssn"], "");
                    }
                }
                catch (Exception)
                {
                    // do nothing? Maybe log this?
                }

                if (customerAccount != null)
                {
                    model.CustomerAccount = customerAccount;
                    model.RepId = hashValues["IgniteAssociate"];
                }

                if (string.IsNullOrEmpty(model.RepId) && !string.IsNullOrEmpty(model.CustomerAccount.CisAccountNumber))
                {
                    model.RepId = accountService.GetIgniteAssociateFromCustomerNumber("Ignite", "3t8sh8f3sg", model.CustomerAccount.CisAccountNumber);
                }
            }

            return View("~/Views/Pages/Marketing/Services/HomeLife Services.cshtml", model);
        }
    }
}
