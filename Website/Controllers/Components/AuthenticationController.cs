using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers.Components
{
    public class AuthenticationController : Controller
    {
        public ActionResult LoginIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.LoginRequest();

            return View("~/Views/Components/Authentication/My Stream Account.cshtml", model);
        }

        public ActionResult FindAccountIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.FindAccountRequest();

            return View("~/Views/Components/Authentication/Create Account - Step 1.cshtml", model);
        }

        public ActionResult CreateLoginIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.CreateLoginRequest();

            return View("~/Views/Components/Authentication/Create Account - Step 2.cshtml", model);
        }

        public ActionResult GetUserChallengeQuestionsIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.GetUserChallengeQuestionsRequest();

            return View("~/Views/Components/Authentication/Forgot Password - Step 1.cshtml", model);
        }

        public ActionResult SendResetPasswordEmailIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.SendResetPasswordEmailRequest();

            return View("~/Views/Components/Authentication/Forgot Password - Step 2.cshtml", model);
        }

        public ActionResult RecoverUsernameIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.RecoverUsernameRequest();

            return View("~/Views/Components/Authentication/Forgot Username.cshtml", model);
        }

        public ActionResult ChangePasswordIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.ChangePasswordRequest();

            return View("~/Views/Components/Authentication/Change Password.cshtml", model);
        }
    }
}