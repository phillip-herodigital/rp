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
    public static class EnrollmentTrafficCopHelper
    {
        private const string cookieName = "StreamEnrollmentTraffic";
        private const string cookieEncryptionPassword = "StreamEnergy";
        private readonly static Random random = new Random();

        public class Injection
        {
            [Dependency]
            public HttpContextBase Context { get; set; }
        }

        public static void HandlePersistence(out bool useRemoteEnrollment, out NameValueCollection queryString, int Percentage = 100)
        {
            var dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
            if (!LoadFromCookie(dependencies.Context.Request.Cookies[cookieName], out queryString, out useRemoteEnrollment))
            {
                useRemoteEnrollment = random.NextDouble() * 100 >= Percentage;
                queryString = dependencies.Context.Request.QueryString;
            }
            else if (dependencies.Context.Request.QueryString.Keys.Count > 0)
            {
                var newQueryString = HttpUtility.ParseQueryString(dependencies.Context.Request.QueryString.ToString());
                if (queryString != null)
                {
                    foreach(string key in queryString.Keys)
                    {
                        if (string.IsNullOrEmpty(newQueryString[key]) && !string.IsNullOrEmpty(key))
                        {
                            newQueryString[key] = queryString[key];
                        }
                    }
                }
                queryString = newQueryString;
            }

            if (Percentage <= 0)
            {
                useRemoteEnrollment = true;
            }
            else if (Percentage >= 100)
            {
                useRemoteEnrollment = false;
            }

            WriteCookie(queryString, useRemoteEnrollment, dependencies.Context);
        }

        private static void WriteCookie(NameValueCollection queryString, bool useRemoteEnrollment, HttpContextBase Context)
        {
            var cookieRawValue = (useRemoteEnrollment ? "1" : "0") + queryString.ToString();

            Context.Response.AppendCookie(new HttpCookie(cookieName, Cryptography.Encrypt(cookieRawValue, cookieEncryptionPassword))
            {
                Expires = DateTime.Today.AddDays(30),
                HttpOnly = true
            });
        }

        private static bool LoadFromCookie(HttpCookie httpCookie, out NameValueCollection queryString, out bool useRemoteEnrollment)
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