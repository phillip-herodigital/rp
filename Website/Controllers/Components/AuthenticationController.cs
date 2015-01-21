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
            if (User.Identity.IsAuthenticated)
            {
                System.Web.Security.FormsAuthentication.SignOut();
                return Redirect(Request.RawUrl);
            }
            if (Request.Cookies["username"] != null)
            {
                return View("~/Views/Components/Authentication/My Stream Account.cshtml", new Models.Authentication.LoginRequest
                    {
                        Username = HttpUtility.UrlDecode(Request.Cookies["username"].Value),
                        RememberMe = true
                    });
            }
            else
            {
                return View("~/Views/Components/Authentication/My Stream Account.cshtml");
            }
        }

        public ActionResult FindAccountIndex()
        {
            return View("~/Views/Components/Authentication/Create Account - Step 1.cshtml");
        }

        public ActionResult CreateLoginIndex()
        {
            return View("~/Views/Components/Authentication/Create Account - Step 2.cshtml");
        }

        public ActionResult GetUserChallengeQuestionsIndex(string token)
        {
            ModelState.Translate();
            ViewBag.TokenExpired = (token == "expired");
            return View("~/Views/Components/Authentication/Forgot Password - Step 1.cshtml");
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
                ViewBag.Username = "john.smith";
                return View("~/Views/Components/Authentication/Change Password.cshtml");
            }
            else if (resetPasswordTokenManager.VerifyPasswordResetToken(token, username))
            {
                ChangePasswordRequest req = new ChangePasswordRequest();
                req.ResetToken = token;

                // TODO - pull from Stream Connect
                ViewBag.Name = "Account Name";
                ViewBag.Username = username;
                return View("~/Views/Components/Authentication/Change Password.cshtml", req);
            }
            else if (Request.AppRelativeCurrentExecutionFilePath.Contains("/auth/reset-password"))
            {
                return View("~/Views/Components/Authentication/Change Password.cshtml");
            }
            else
            {
                return Redirect("~/auth/reset-password/?token=expired&username=" + username);
            }
        }

        public ActionResult ImpersonateIndex()
        {
            return View("~/Views/Components/Authentication/Impersonate.cshtml");
        }
    }
}