using StreamEnergy.DomainModels;
using StreamEnergy.Services.Clients;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class MarketingController : Controller
    {
        private IEmailService emailService;
        public MarketingController (IEmailService emailService)
        {
            this.emailService = emailService;
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
    }
}
