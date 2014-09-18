using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using Microsoft.Practices.Unity;
using StreamEnergy.StreamEnergyBilling.IstaTokenization;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Text;
using System.IO;

namespace StreamEnergy.MyStream.Conditions
{
    public class EnrollmentTrafficCopCondition<T> : WhenCondition<T>
        where T : Sitecore.Rules.RuleContext
    {
        private const string cookieName = "StreamEnrollmentTraffic";
        private const string cookieEncryptionPassword = "StreamEnergy";
        private Injection dependencies;
        private readonly static Random random = new Random();

        public class Injection
        {
            [Dependency]
            public HttpContextBase Context { get; set; }

            [Dependency]
            public Interpreters.IDpiEnrollmentParameters EnrollmentParameters { get; set; }

            [Dependency]
            public IDpiTokenService DpiTokenService { get; set; }
        }

        public int Percentage { get; set; }

        public EnrollmentTrafficCopCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public EnrollmentTrafficCopCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            // Ultimately, there are two things to cookie: query string values and whether to use local or remote enrollments.
            // If the query string is empty and the cookie exists, we should load the query string values from the cookie.
            // If we get to making a decision on the "cracked door", we should load the previous result from the cookie.
            bool useRemoteEnrollment;
            NameValueCollection queryString;

            HandlePersistence(out useRemoteEnrollment, out queryString);

            dependencies.EnrollmentParameters.Initialize(queryString);

            dependencies.Context.Items["Enrollment Dpi Parameters"] = queryString;

            var targetDpiUrl = dependencies.EnrollmentParameters.GetTargetDpiUrlBuilder();

            if (targetDpiUrl == null)
                return false;

            bool redirect = false;

            // Prevent non-TX enrollments from viewing our enrollment page.
            redirect = redirect || dependencies.EnrollmentParameters.State != "TX";

            // "cracked door" - allow less than 100% through to our own enrollment.
            redirect = redirect || useRemoteEnrollment;

            if (redirect)
            {
                var targetUrl = targetDpiUrl();
                if (!string.IsNullOrEmpty(targetUrl))
                {
                    dependencies.Context.Response.Redirect(targetUrl, false);
                }
            }

            return false;
        }

        private void HandlePersistence(out bool useRemoteEnrollment, out NameValueCollection queryString)
        {
            if (!LoadFromCookie(dependencies.Context.Request.Cookies[cookieName], out queryString, out useRemoteEnrollment))
            {
                useRemoteEnrollment = random.NextDouble() * 100 >= Percentage;
                queryString = dependencies.Context.Request.QueryString;
            }
            else if (dependencies.Context.Request.QueryString.Keys.Count > 0)
            {
                queryString = dependencies.Context.Request.QueryString;
            }

            WriteCookie(queryString, useRemoteEnrollment);
        }

        private void WriteCookie(NameValueCollection queryString, bool useRemoteEnrollment)
        {
            var cookieRawValue = (useRemoteEnrollment ? "1" : "0") + queryString.ToString();

            dependencies.Context.Response.AppendCookie(new HttpCookie(cookieName, Cryptography.Encrypt(cookieRawValue, cookieEncryptionPassword))
            {
                Expires = DateTime.Today.AddDays(30),
                HttpOnly = true
            });
        }

        private bool LoadFromCookie(HttpCookie httpCookie, out NameValueCollection queryString, out bool useRemoteEnrollment)
        {
            queryString = null;
            useRemoteEnrollment = false;
            if (httpCookie == null)
                return false;

            var cookieRawValue = Cryptography.Decrypt(httpCookie.Value, cookieEncryptionPassword);
            if (string.IsNullOrEmpty(cookieRawValue))
                return false;

            useRemoteEnrollment = cookieRawValue[0] == '1';
            queryString = HttpUtility.ParseQueryString(cookieRawValue.Substring(1));
            return true;
        }

    }
}