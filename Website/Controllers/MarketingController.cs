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
        public ActionResult ContactIndex(StreamEnergy.MyStream.Models.Marketing.Contact contact)
        {
            // Validate form data
            if (ModelState.IsValid)
            {
                // Get the form data
                var FirstName = contact.ContactName.First;
                var LastName = contact.ContactName.Last;
                var AddressLine1 = contact.ContactAddress.Line1;
                var City = contact.ContactAddress.City;
                var StateAbbreviation = contact.ContactAddress.StateAbbreviation;
                var PostalCode5 = contact.ContactAddress.PostalCode5;
                var Phone = contact.ContactPhone.Number;
                var Email = contact.ContactEmail.Address;
                var Reason = contact.Reason;
                var Comment = contact.Comment;
                var Name = FirstName + ' ' + LastName;

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
                    "<br /> Comments: " + Comment;

                this.emailService.SendEmail(Message);

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
                var ReturnURL = new RedirectResult(Request.Url.AbsolutePath + "?success=true##success-message");
                return ReturnURL;
            }
            else
            {
                return View("~/Views/Pages/Marketing/Services/Enroll Commercial.cshtml", contact);
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
