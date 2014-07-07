using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using StreamEnergy.Extensions;
using StreamEnergy.DomainModels.Accounts.ResetPassword;
using StreamEnergy.MyStream.Models.Authentication;

namespace StreamEnergy.MyStream.Controllers.Components
{
    public class AuthenticationController : Controller
    {
        private readonly ResetPasswordTokenManager resetPasswordTokenManager;

        public AuthenticationController(ResetPasswordTokenManager resetPasswordTokenManager)
        {
            this.resetPasswordTokenManager = resetPasswordTokenManager;
        }

        public ActionResult LoginIndex()
        {
            return View("~/Views/Components/Authentication/My Stream Account.cshtml");
        }

        public ActionResult FindAccountIndex()
        {
            return View("~/Views/Components/Authentication/Create Account - Step 1.cshtml");
        }

        public ActionResult CreateLoginIndex()
        {
            return View("~/Views/Components/Authentication/Create Account - Step 2.cshtml");
        }

        public ActionResult GetUserChallengeQuestionsIndex(StreamEnergy.DomainModels.Accounts.ResetPassword.ResetPasswordContext context, string token)
        {
            ModelState.Translate();
            ViewBag.TokenExpired = (token == "expired");
            return View("~/Views/Components/Authentication/Forgot Password - Step 1.cshtml", context);
        }

        public ActionResult SendResetPasswordEmailIndex()
        {
            return View("~/Views/Components/Authentication/Forgot Password - Step 2.cshtml");
        }

        public ActionResult RecoverUsernameIndex()
        {
            return View("~/Views/Components/Authentication/Forgot Username.cshtml");
        }

        public ActionResult ChangePasswordIndex(string token, string username)
        {
            if (!Sitecore.Context.PageMode.IsNormal)
            {
                ViewBag.Name = "John Smith";
                ViewBag.AccountNumber = "12534567890";
                ViewBag.Username = "john.smith";
                return View("~/Views/Components/Authentication/Change Password.cshtml");
            }
            else if (Request.AppRelativeCurrentExecutionFilePath.Contains("/auth/reset-password") || resetPasswordTokenManager.VerifyPasswordResetToken(token, username))
            {
                ChangePasswordRequest req = new ChangePasswordRequest();
                req.ResetToken = token;

                // TODO - pull from Stream Connect
                ViewBag.Name = "Account Name";
                ViewBag.AccountNumber = "";
                ViewBag.Username = username;
                return View("~/Views/Components/Authentication/Change Password.cshtml", req);
            }
            else
            {
                return Redirect("~/auth/reset-password/?token=expired&username=" + username);
            }
        }
    }
}