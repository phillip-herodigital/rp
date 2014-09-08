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
            public IDpiTokenService DpiTokenService { get; set; }

            [Dependency("DpiEnrollmentFormDomain")]
            public string DpiEnrollmentFormDomain { get; set; }
        }

        static class Cryptography
        {
            #region Settings

            private static int _iterations = 2;
            private static int _keySize = 128;

            private static string _hash = "SHA1";
            private static string _salt =   "8f9huif345utnfkj"; // Random
            private static string _vector = "542jknvzx654fjks"; // Random

            #endregion

            public static string Encrypt(string value, string password)
            {
                byte[] vectorBytes = Encoding.ASCII.GetBytes(_vector);
                byte[] saltBytes = Encoding.ASCII.GetBytes(_salt);
                byte[] valueBytes = Encoding.UTF8.GetBytes(value);

                byte[] encrypted;
                using (AesManaged cipher = new AesManaged())
                {
                    PasswordDeriveBytes _passwordBytes =
                        new PasswordDeriveBytes(password, saltBytes, _hash, _iterations);
                    byte[] keyBytes = _passwordBytes.GetBytes(_keySize / 8);

                    cipher.Mode = CipherMode.CBC;

                    using (ICryptoTransform encryptor = cipher.CreateEncryptor(keyBytes, vectorBytes))
                    {
                        using (MemoryStream to = new MemoryStream())
                        {
                            using (CryptoStream writer = new CryptoStream(to, encryptor, CryptoStreamMode.Write))
                            {
                                writer.Write(valueBytes, 0, valueBytes.Length);
                                writer.FlushFinalBlock();
                                encrypted = to.ToArray();
                            }
                        }
                    }
                    cipher.Clear();
                }
                return Convert.ToBase64String(encrypted);
            }

            public static string Decrypt(string value, string password)
            {
                byte[] vectorBytes = ASCIIEncoding.ASCII.GetBytes(_vector);
                byte[] saltBytes = ASCIIEncoding.ASCII.GetBytes(_salt);
                byte[] valueBytes = Convert.FromBase64String(value);

                byte[] decrypted;
                int decryptedByteCount = 0;

                using (AesManaged cipher = new AesManaged())
                {
                    PasswordDeriveBytes _passwordBytes = new PasswordDeriveBytes(password, saltBytes, _hash, _iterations);
                    byte[] keyBytes = _passwordBytes.GetBytes(_keySize / 8);

                    cipher.Mode = CipherMode.CBC;

                    try
                    {
                        using (ICryptoTransform decryptor = cipher.CreateDecryptor(keyBytes, vectorBytes))
                        {
                            using (MemoryStream from = new MemoryStream(valueBytes))
                            {
                                using (CryptoStream reader = new CryptoStream(from, decryptor, CryptoStreamMode.Read))
                                {
                                    decrypted = new byte[valueBytes.Length];
                                    decryptedByteCount = reader.Read(decrypted, 0, decrypted.Length);
                                }
                            }
                        }
                    }
                    catch (Exception)
                    {
                        return String.Empty;
                    }

                    cipher.Clear();
                }
                return Encoding.UTF8.GetString(decrypted, 0, decryptedByteCount);
            }

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
            bool useSitecoreEnrollment;
            NameValueCollection queryString;

            if (!LoadFromCookie(dependencies.Context.Request.Cookies[cookieName], out queryString, out useSitecoreEnrollment))
            {
                useSitecoreEnrollment = random.NextDouble() * 100 >= Percentage;
                queryString = dependencies.Context.Request.QueryString;
            }
            else if (dependencies.Context.Request.QueryString.Keys.Count > 0)
            {
                queryString = dependencies.Context.Request.QueryString;
            }

            WriteCookie(queryString, useSitecoreEnrollment);

            var accountType = (queryString["AccountType"] ?? "").ToUpper();
            var state = (queryString["State"] ?? "").ToUpper();
            var accountNumber = GetAccountNumber(queryString["SPID"] ?? "");

            dependencies.Context.Items["Enrollment Agent Account Id"] = accountNumber;

            var targetDpiUrl = GetTargetDpiUrl(accountType, state, queryString);

            if (targetDpiUrl == null)
                return false;

            bool redirect = false;

            // Prevent non-TX enrollments from viewing our enrollment page.
            redirect = redirect || state != "TX";

            // "cracked door" - allow less than 100% through to our own enrollment.
            redirect = redirect || useSitecoreEnrollment;

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

        private void WriteCookie(NameValueCollection queryString, bool useSitecoreEnrollment)
        {
            var cookieRawValue = (useSitecoreEnrollment ? "1" : "0") + queryString.ToString();

            dependencies.Context.Response.AppendCookie(new HttpCookie(cookieName, Cryptography.Encrypt(cookieRawValue, cookieEncryptionPassword))
            {
                Expires = DateTime.Today.AddDays(30),
                HttpOnly = true
            });
        }

        private bool LoadFromCookie(HttpCookie httpCookie, out NameValueCollection queryString, out bool useSitecoreEnrollment)
        {
            queryString = null;
            useSitecoreEnrollment = false;
            if (httpCookie == null)
                return false;

            var cookieRawValue = Cryptography.Decrypt(httpCookie.Value, cookieEncryptionPassword);
            if (string.IsNullOrEmpty(cookieRawValue))
                return false;

            useSitecoreEnrollment = cookieRawValue[0] == '1';
            queryString = HttpUtility.ParseQueryString(cookieRawValue.Substring(1));
            return true;
        }

        private Func<string> GetTargetDpiUrl(string accountType, string state, NameValueCollection queryString)
        {
            switch (accountType)
            {
                case "R":
                    switch (state)
                    {
                        case "TX":
                        case "GA":
                            return () => BuildDpiUrl("/signup_customer.asp", dependencies.DpiEnrollmentFormDomain, queryString);
                        case "NE":
                            return () => BuildTokenizedUrl(dependencies.DpiTokenService, queryString);
                    }
                    break;
                case "C":

                    switch (state)
                    {
                        case "TX":
                            return () => BuildDpiUrl("/nr_quote_zip.asp", dependencies.DpiEnrollmentFormDomain, queryString);
                        case "GA":
                            return () => BuildDpiUrl("/signup_customer.asp", dependencies.DpiEnrollmentFormDomain, queryString);
                        case "NE":
                            return () => BuildTokenizedUrl(dependencies.DpiTokenService, queryString);
                    }
                    break;
            }
            return null;
        }

        private static string BuildTokenizedUrl(IDpiTokenService dpiTokenService, NameValueCollection queryString)
        {
            return dpiTokenService.GetDpiTokenUrl(new GetUrlRequest() 
            {
                // TODO - is AccountName required?
                AccountNumber = GetAccountNumber(queryString["SPID"]),
                CustomerType = (queryString["AccountType"] ?? "").ToUpper(),
                DesignatedCustomer = queryString["GID"] ,
                Language = TranslateLanguage(queryString["CO_LA"]),
                Source = queryString["RefSiteID"] ?? TranslateRefSite(queryString["RefSite"]),
                StateAbbrev = queryString["St"] ?? queryString["State"],
            });
        }

        private static string TranslateRefSite(string p)
        {
            switch (p)
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
            return p;
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

        private static string BuildDpiUrl(string relativePath, string dpiDomain, NameValueCollection queryString)
        {
            return new UriBuilder(new Uri(new Uri(dpiDomain), relativePath))
            {
                Query = queryString.ToString()
            }.Uri.ToString();
        }
    }
}