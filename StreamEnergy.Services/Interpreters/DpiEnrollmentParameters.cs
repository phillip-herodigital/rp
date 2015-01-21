using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.StreamEnergyBilling.IstaTokenization;
using StreamEnergy.Logging;

namespace StreamEnergy.Interpreters
{
    class DpiEnrollmentParameters : IDpiEnrollmentParameters
    {
        private System.Collections.Specialized.NameValueCollection queryString;
        private readonly string dpiEnrollmentFormDomain;
        private readonly string DpiAuthID;
        private readonly string DpiAuthPwd;
        private readonly IDpiTokenService dpiTokenService;
        private readonly ILogger logger;

        public DpiEnrollmentParameters([Dependency("DpiEnrollmentFormDomain")] string dpiEnrollmentFormDomain, IDpiTokenService dpiTokenService, [Dependency("DpiAuthID")] string DpiAuthID, [Dependency("DpiAuthPwd")] string DpiAuthPwd, ILogger logger)
        {
            this.dpiEnrollmentFormDomain = dpiEnrollmentFormDomain;
            this.DpiAuthID = DpiAuthID;
            this.DpiAuthPwd = DpiAuthPwd;
            this.dpiTokenService = dpiTokenService;
            this.logger = logger;
        }

        public void Initialize(System.Collections.Specialized.NameValueCollection queryString)
        {
            this.queryString = queryString;
        }

        public string AccountType
        {
            get { return (queryString["AccountType"] ?? "R").ToUpper(); }
        }

        public string ServiceType
        {
            get { return (queryString["ServiceType"] ?? "").ToUpper(); }
        }

        public string State
        {
            get { return ((queryString["St"] ?? queryString["State"]) ?? "").ToUpper(); }
        }

        public string AccountNumber
        {
            get { return GetAccountNumber(queryString["SPID"] ?? "A2"); }
        }

        public Newtonsoft.Json.Linq.JObject ToStreamConnectSalesInfo()
        {
            if (queryString == null)
                return Newtonsoft.Json.Linq.JObject.FromObject(new
                {
                    AgentId = (string)null,
                    FreeEnergyReferralId = (string)null,
                    SalesSource = "Other"
                });

            return Newtonsoft.Json.Linq.JObject.FromObject(new
            {
                AgentId = AccountNumber,
                FreeEnergyReferralId = queryString["GID"],
                SalesSource = TranslateRefSiteToSalesSource()
            });
        }

        public Func<string> GetTargetDpiUrlBuilder()
        {
            switch (AccountType)
            {
                case "R":
                    switch (State)
                    {
                        case "TX":
                        case "GA":
                            return () => BuildDpiUrl("/signup_customer.asp");
                        case "PA":
                        case "MD":
                        case "NJ":
                        case "NY":
                        case "DC":
                        case "NE":
                            return BuildTokenizedUrl;
                        default:
                            return () => (ServiceType == "GAS") ? "/services/gas" : "/services/electricity";
                    }
                case "C":

                    switch (State)
                    {
                        case "TX":
                            return () => BuildDpiUrl("/nr_quote_zip.asp");
                        case "GA":
                            return () => BuildCommercialRFQUrl();
                        case "PA":
                        case "MD":
                        case "NJ":
                        case "NY":
                        case "DC":
                        case "NE":
                            return BuildTokenizedUrl;
                        default:
                            return () => BuildCommercialRFQUrl();
                    }
            }
            return null;
        }

        private string BuildCommercialRFQUrl()
        {
            return "/services/enroll/commercial?" + queryString.ToString();
        }

        private string BuildDpiUrl(string relativePath)
        {
            return new UriBuilder(new Uri(new Uri(dpiEnrollmentFormDomain), relativePath))
            {
                Query = queryString.ToString()
            }.Uri.ToString();
        }

        private static string GetAccountNumber(string p)
        {
            if (string.IsNullOrEmpty(p))
            {
                return "A2";
            }
            // "decryption"
            try
            {
                var plain = System.Text.Encoding.ASCII.GetString(Convert.FromBase64String(p));
                var parts = plain.Split('|');
                return parts[0];
            }
            catch
            {
                return "A2";
            }
        }

        private string BuildTokenizedUrl()
        {
            var request = new GetUrlRequest()
            {
                AccountName = "Unassigned Customer",
                AccountNumber = GetAccountNumber(queryString["SPID"]),
                CustomerType = AccountType,
                DesignatedCustomer = queryString["GID"],
                Language = TranslateLanguage(queryString["CO_LA"]),
                Source = queryString["RefSiteID"] ?? TranslateRefSite(),
                StateAbbrev = queryString["St"] ?? queryString["State"],
                AuthId = DpiAuthID,
                AuthPwd = DpiAuthPwd,
            };
            try
            {
                var response = dpiTokenService.GetDpiTokenUrl(request);
                if (!string.IsNullOrEmpty(response))
                {
                    return response;
                }
            }
            catch (Exception ex)
            {
                logger.Record("Error calling GetDpiTokenUrl", ex);
            }
            

            request.AccountNumber = "A2";

            try
            {
                var response = dpiTokenService.GetDpiTokenUrl(request);
                if (!string.IsNullOrEmpty(response))
                {
                    return response;
                }
            }
            catch (Exception ex)
            {
                logger.Record("Error calling GetDpiTokenUrl", ex);
            }

            return "/enrollment/please-contact";
        }

        private string TranslateRefSite()
        {
            switch (queryString["RefSite"])
            {
                case "DCA": return "3";	// Other
                case "SCS": return "4";	// streamenergy.net
                case "IHS": return "5";	// igniteinc.biz
                case "MSE": return "6";	// mystreamenergy.biz
                case "SFR": return "7";	// streampowerup.biz
                case "MYS": return "8";	// mystream.com
                case "FER": return "9";	// free.mystream.com
                case "MYI": return "10"; // myignite.com
            }
            return queryString["RefSite"];
        }

        private string TranslateRefSiteToSalesSource()
        {
            switch (queryString["RefSiteID"] ?? queryString["RefSite"])
            {
                case "1":
                    return "Paper";
                case "2":
                    return "Call";
                case "DCA":
                case "3": 
                    return "Other";
                case "SCS": 
                case "4":	// streamenergy.net
                    return "StreamWebsite";
                case "IHS": 
                case "5":	// igniteinc.biz
                    return "IgniteHomesite";
                case "MSE": 
                case "6":	// mystreamenergy.biz
                    return "IgniteStreamHomesite";
                case "SFR": 
                case "7":	// streampowerup.biz
                    return "IgniteFindraiser";
                case "MYS": 
                case "8":	// mystream.com
                    return "MyStreamWebSite";
                case "FER": 
                case "9":	// free.mystream.com
                    return "FreeEnergyWebSite";
                case "MYI": 
                case "10": // myignite.com
                    return "MyIgniteHomesite";
            }
            return "Other";
        }

        private static string TranslateLanguage(string p)
        {
            switch (p)
            {
                case "US_EN": return "1";
                case "US_ES": return "2";
            }
            return p;
        }

    }
}
