using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using StackExchange.Redis;
using StreamEnergy.Services.Clients.Interceptors;

namespace StreamEnergy.Services.Clients
{
    public class AzureAccessControlServiceTokenManager
    {
        private static readonly string acsTokenRedisKey;
        private readonly IDatabase redisDatabase;
        private readonly AzureAcsConfiguration config;
        private readonly HttpClient client;

        static AzureAccessControlServiceTokenManager()
        {
            acsTokenRedisKey = typeof(AzureAccessControlServiceTokenManager).FullName;
        }

        public AzureAccessControlServiceTokenManager(HttpClient client, IDatabase redisDatabase, AzureAcsConfiguration config)
        {
            this.client = client;
            client.BaseAddress = config.Url;
            this.redisDatabase = redisDatabase;
            this.config = config;
        }

        public async Task<System.Net.Http.Headers.AuthenticationHeaderValue> GetAuthorization()
        {
            var token = await GetSwtToken();
            return new System.Net.Http.Headers.AuthenticationHeaderValue("OAuth2", "access_token=\"" + token + "\"");
        }

        public async Task<string> GetSwtToken()
        {
            string swt = await redisDatabase.StringGetAsync(acsTokenRedisKey + "_" + config.Url);
            if (swt == null)
            {
                swt = await AcquireRemoteSwtToken();
                var expiresEpoch = int.Parse(HttpUtility.ParseQueryString(swt)["ExpiresOn"]);
                var expires = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expiresEpoch);
                TimeSpan expireTime = expires - DateTime.UtcNow;

                await redisDatabase.StringSetAsync(acsTokenRedisKey + "_" + config.Url, swt, expireTime);
            }

            return swt;
        }

        private async Task<string> AcquireRemoteSwtToken()
        {
            var content = new FormUrlEncodedContent(new []
                {
                    new KeyValuePair<string, string>("wrap_scope", config.Realm),
                    new KeyValuePair<string, string>("wrap_assertion_format", "SWT"),
                    new KeyValuePair<string, string>("wrap_assertion", CreateLocalSwtToken())
                });
            var response = await client.PostAsync("/WRAPv0.9/", content);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var formData = await response.Content.ReadAsFormDataAsync();

            return formData["wrap_access_token"];
        }

        private string CreateLocalSwtToken()
        {
            var builder = new StringBuilder();
            builder.Append("Issuer=");
            builder.Append(HttpUtility.UrlEncode(config.IdentityName));

            string signature = this.GenerateSignature(builder.ToString(), config.IdentityKey);
            builder.Append("&HMACSHA256=");
            builder.Append(signature);

            return builder.ToString();
        }

        private string GenerateSignature(string unsignedToken, string signingKey)
        {
            var hmac = new HMACSHA256(Convert.FromBase64String(signingKey));

            byte[] locallyGeneratedSignatureInBytes = hmac.ComputeHash(Encoding.ASCII.GetBytes(unsignedToken));

            string locallyGeneratedSignature = HttpUtility.UrlEncode(Convert.ToBase64String(locallyGeneratedSignatureInBytes));

            return locallyGeneratedSignature;
        }
    }
}
