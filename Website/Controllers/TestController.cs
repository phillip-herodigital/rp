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
    public class TestController : Controller
    {
        private IEmailService emailService;
        public TestController (IEmailService emailService)
        {
            this.emailService = emailService;
        }

        public ActionResult ContactIndex()
        {
            return View("~/Views/Pages/Marketing/Contact/Contact.cshtml");
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
                MailAddress To = new MailAddress("adam.powell@responsivepath.com", "Adam Powell");
                MailMessage Message = new MailMessage(From, To);
                Message.Subject = "New Contact Form Submission";
                Message.IsBodyHtml = true;
                Message.Body = "First Name: " + FirstName + "<br />Last Name: " + LastName + "<br />Address: " + AddressLine1 + "<br />" + City + ", " + StateAbbreviation + " " + PostalCode5
                        + "<br />Phone: " + Phone + "<br />Email: " + Email + "<br />Reason: " + Reason + "<br /> Comments: " + Comments;

                var result = this.emailService.SendEmail(Message);
                // TODO - Send the success message or load a new view

                return RedirectToAction("Index");
            }
            catch
            {
                return View("~/Views/Pages/Marketing/Contact/Contact.cshtml");
            }
        }

    }
}
