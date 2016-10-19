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
using StreamEnergy.Services.Helpers;
using ResponsivePath.Logging;

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

            [Dependency]
            public ISettings Settings { get; set; }

            [Dependency]
            public ILogger logger { get; set; }
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

            EnrollmentTrafficCopHelper.HandlePersistence(out useRemoteEnrollment, out queryString, Percentage);

            dependencies.EnrollmentParameters.Initialize(queryString);

            var targetDpiUrl = dependencies.EnrollmentParameters.GetTargetDpiUrlBuilder();

            var referrer = System.Web.HttpContext.Current.Request.UrlReferrer;

            dependencies.logger.Record("EnrollmentTrafficCopCondition.Execute", (referrer != null && referrer.Host != System.Web.HttpContext.Current.Request.Url.Host && dependencies.EnrollmentParameters.AccountNumber == "A2") ? Severity.Error : Severity.Debug, new Dictionary<string, object>
            {
                { "Referrer", referrer },
                { "AssociateID", dependencies.EnrollmentParameters.AccountNumber },
            });

            if (targetDpiUrl == null || queryString["renewal"] == "true")
                return false;

            bool redirect = false;

            // "cracked door" - allow less than 100% through to our own enrollment.
            redirect = redirect || useRemoteEnrollment;

            redirect = redirect || (dependencies.EnrollmentParameters.AccountType == "C");

            if (dependencies.Context.Request.QueryString["script"] == "true")
            {
                dependencies.Context.Response.End();
            }
            if (!string.IsNullOrEmpty(dependencies.Settings.GetSettingsValue("Maintenance Mode", "Ista Maintenance Mode")))
            {
                if (dependencies.EnrollmentParameters.State == "GA")
                {
                    dependencies.Context.Response.Redirect("/ga-upgrade-faq", false);
                }
                else if (dependencies.EnrollmentParameters.ServiceType != "ELE" && dependencies.EnrollmentParameters.ServiceType != "MOB" && dependencies.EnrollmentParameters.ServiceType != "PRO")
                {
                    dependencies.Context.Response.Redirect("/maintenance", false);
                }
            }
            else if (redirect)
            {
                var targetUrl = targetDpiUrl();
                if (!string.IsNullOrEmpty(targetUrl))
                {
                    dependencies.Context.Response.Redirect(targetUrl, false);
                }
            }

            return false;
        }
    }
}