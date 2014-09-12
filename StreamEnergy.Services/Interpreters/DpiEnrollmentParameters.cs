using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.StreamEnergyBilling.IstaTokenization;

namespace StreamEnergy.Interpreters
{
    class DpiEnrollmentParameters : IDpiEnrollmentParameters
    {
        private System.Collections.Specialized.NameValueCollection queryString;
        private readonly string dpiEnrollmentFormDomain;
        private readonly IDpiTokenService dpiTokenService;

        public DpiEnrollmentParameters([Dependency("DpiEnrollmentFormDomain")] string dpiEnrollmentFormDomain, IDpiTokenService dpiTokenService)
        {
            this.dpiEnrollmentFormDomain = dpiEnrollmentFormDomain;
            this.dpiTokenService = dpiTokenService;
        }

        public void Initialize(System.Collections.Specialized.NameValueCollection queryString)
        {
            this.queryString = queryString;
        }

        public string AccountType
        {
            get { return (queryString["AccountType"] ?? "").ToUpper(); }
        }

        public string State
        {
            get { return (queryString["State"] ?? "").ToUpper(); }
        }

        public string AccountNumber
        {
            get { return GetAccountNumber(queryString["SPID"] ?? ""); }
        }

        public Newtonsoft.Json.Linq.JObject ToStreamConnectSalesInfo()
        {
            if (queryString == null)
                return null;

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
                        case "NE":
                            return BuildTokenizedUrl;
                    }
                    break;
                case "C":

                    switch (State)
                    {
                        case "TX":
                            return () => BuildDpiUrl("/nr_quote_zip.asp");
                        case "GA":
                            return () => BuildDpiUrl("/signup_customer.asp");
                        case "NE":
                            return BuildTokenizedUrl;
                    }
                    break;
            }
            return null;
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
            // "decryption"
            try
            {
                var plain = System.Text.Encoding.ASCII.GetString(Convert.FromBase64String(p));
                var parts = plain.Split('|');
                return parts[0];
            }
            catch
            {
                return "";
            }
        }

        private string BuildTokenizedUrl()
        {
            return dpiTokenService.GetDpiTokenUrl(new GetUrlRequest()
            {
                // TODO - is AccountName required?
                AccountNumber = GetAccountNumber(queryString["SPID"]),
                CustomerType = AccountType,
                DesignatedCustomer = queryString["GID"],
                Language = TranslateLanguage(queryString["CO_LA"]),
                Source = queryString["RefSiteID"] ?? TranslateRefSite(),
                StateAbbrev = queryString["St"] ?? queryString["State"],
            });
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
