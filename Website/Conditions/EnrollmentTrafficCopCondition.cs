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

            [Dependency]
            public ISettings Settings { get; set; }
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

            dependencies.Context.Items["Enrollment Dpi Parameters"] = queryString;

            var targetDpiUrl = dependencies.EnrollmentParameters.GetTargetDpiUrlBuilder();

            if (targetDpiUrl == null || queryString["renewal"] == "true")
                return false;

            bool redirect = false;

            // Prevent non-TX enrollments from viewing our enrollment page.
            redirect = redirect || dependencies.EnrollmentParameters.State != "TX";

            // "cracked door" - allow less than 100% through to our own enrollment.
            redirect = redirect || useRemoteEnrollment;

            redirect = redirect || (dependencies.EnrollmentParameters.AccountType == "C");

            //redirect = redirect || (dependencies.EnrollmentParameters.ServiceType == "MOB");

            if (!string.IsNullOrEmpty(dependencies.Settings.GetSettingsValue("Maintenance Mode", "Ista Maintenance Mode")))
            {
                if (dependencies.EnrollmentParameters.State == "GA")
                {
                    dependencies.Context.Response.Redirect("/ga-upgrade-faq", false);
                }
                else if (dependencies.EnrollmentParameters.State != "TX")
                {
                    dependencies.Context.Response.Redirect("/maintenance", false);
                }
            }
            else if (redirect && (dependencies.EnrollmentParameters.State != "GA" || dependencies.EnrollmentParameters.AccountType == "C"))
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