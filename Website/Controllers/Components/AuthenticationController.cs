﻿using System;
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

        public ActionResult GetUserChallengeQuestionsIndex()
        {
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

        public ActionResult ChangePasswordIndex()
        {
            return View("~/Views/Components/Authentication/Change Password.cshtml");
        }
    }
}