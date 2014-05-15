using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class TempController : Controller
    {
        public class SampleModel
        {
            public CustomerContact ContactInfo { get; set; }

            [CreditCard]
            public string CardNumber { get; set; }

            public DateTime Date { get; set; }

            public int Integer { get; set; }

            public float Single { get; set; }

            [Url]
            public string Url2 { get; set; }

            [System.ComponentModel.DataAnnotations.MinLength(3)]
            public string MinLength { get; set; }

            [System.ComponentModel.DataAnnotations.MaxLength(3)]
            public string MaxLength { get; set; }

            // WARNING - this doesn't work server-side
            [System.ComponentModel.DataAnnotations.FileExtensions(Extensions = "cs,txt")]
            public HttpPostedFileBase PostedFile { get; set; }

            // This doesn't seem to do us much good
            [System.ComponentModel.DataAnnotations.FileExtensions(Extensions = "cs,txt")]
            public string FileName { get; set; }

            [System.ComponentModel.DataAnnotations.StringLength(5, MinimumLength=2)]
            public string StrLen { get; set; }

            [System.ComponentModel.DataAnnotations.Range(1.5, 7.5)]
            public double Range { get; set; }

            [System.ComponentModel.DataAnnotations.Compare("Range")]
            public double Match { get; set; }

            [Remote("ServiceInformation", "Enrollment", AdditionalFields = "FileName", HttpMethod = "POST")]
            public string Data { get; set; }

            [System.Web.Security.MembershipPassword(
                MinRequiredNonAlphanumericCharacters=2, MinNonAlphanumericCharactersError="Harder", 
                MinRequiredPasswordLength = 6, MinPasswordLengthError="Longer", 
                PasswordStrengthRegularExpression=".", PasswordStrengthError="Stronger")]
            public string Password { get; set; }
        }

        public ActionResult Index(string param)
        {
            if (param == null)
                return View();
            return View(new SampleModel
                {
                    ContactInfo = new DomainModels.CustomerContact
                    {
                        Email = new DomainModels.Email { Address = "test" }
                    }
                });
        }

        [HttpPost]
        public ActionResult Index(SampleModel form)
        {
            return View(form);
        }
	}
}