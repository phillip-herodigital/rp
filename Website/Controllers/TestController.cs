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

        
        //
        // GET: /Test/
        public ActionResult Index()
        {
            return View("~/Views/Pages/Marketing/Contact/Contact.cshtml");
        }

        //
        // POST: /Test/Create
        [HttpPost]
        public ActionResult Index(FormCollection collection)
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

                var Message = new MailMessage();
                Message.Body = Comments;

                // TODO - Validate form data

                // TODO - Send the email
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
