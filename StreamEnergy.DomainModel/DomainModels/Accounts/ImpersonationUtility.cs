﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Accounts
{
    public class ImpersonationUtility
    {
        internal const string DomainPrefix = "impersonation/";
        internal const string SharedSecretKey = "Impersonation Shared Secret";
        private readonly string sharedSecret;
        private readonly IAccountService accountService;

        public ImpersonationUtility(IAccountService accountService, [Dependency(SharedSecretKey)] string sharedSecret)
        {
            this.accountService = accountService;
            this.sharedSecret = sharedSecret;
        }

        public bool Verify(string accountNumber, string expiry, string token)
        {
            var unencrypted = accountNumber + expiry + sharedSecret;
            var date = Json.Read<DateTimeOffset>("'" + expiry + "'");
            if (date < DateTimeOffset.Now ||
                date > DateTimeOffset.Now.AddHours(1))
                return false;

            var expectedToken = Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.ASCII.GetBytes(unencrypted)));
            return token == expectedToken;
        }

        public Task<System.Net.Http.Headers.CookieHeaderValue> CreateAuthenticationCookie(Guid globalCustomerId)
        {
            var cookie = FormsAuthentication.GetAuthCookie(DomainPrefix + globalCustomerId, false, "/");
            return Task.FromResult(new System.Net.Http.Headers.CookieHeaderValue(cookie.Name, cookie.Value)
            {
                Domain = cookie.Domain,
                Expires = cookie.Expires == DateTime.MinValue ? null : (DateTime?)cookie.Expires,
                HttpOnly = cookie.HttpOnly,
                Path = cookie.Path,
                Secure = cookie.Secure
            });
        }

        public Task<System.Net.Http.Headers.CookieHeaderValue> CreateAuthenticationCookie(string username)
        {
            var cookie = FormsAuthentication.GetAuthCookie(username, false, "/");
            return Task.FromResult(new System.Net.Http.Headers.CookieHeaderValue(cookie.Name, cookie.Value)
            {
                Domain = cookie.Domain,
                Expires = cookie.Expires == DateTime.MinValue ? null : (DateTime?)cookie.Expires,
                HttpOnly = cookie.HttpOnly,
                Path = cookie.Path,
                Secure = cookie.Secure
            });
        }
    }
}
