﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.Services.Clients;

namespace StreamEnergy.MyStream.Tests.Services
{
    [TestClass]
    public class GetSwtToken
    {
        [TestMethod]
        public async Task GetSwtTokenTest()
        {
            Moq.Mock<StackExchange.Redis.IDatabase> dbMock = new Moq.Mock<StackExchange.Redis.IDatabase>();
            var target = new AzureAccessControlServiceTokenManager(new System.Net.Http.HttpClient(), dbMock.Object, new AzureAcsConfiguration
                {
                    Url = new Uri("https://streamenergy-dev.accesscontrol.windows.net"),
                    Realm = "https://streamenergy-dev.accesscontrol.windows.net",
                    IdentityName = "portal-streamconnect-sa-dev",
                    IdentityKey = "2xbcOGh+C+SPhXxsnzhrlN/uJ3QvStdh4WX8duu6MQ8="
                });

            var token = await target.GetSwtToken();

            Assert.IsNotNull(token);
        }

        [TestMethod]
        public async Task AddSwtTokenToHttpClient()
        {
            Moq.Mock<StackExchange.Redis.IDatabase> dbMock = new Moq.Mock<StackExchange.Redis.IDatabase>();
            var target = new AzureAccessControlServiceTokenManager(new System.Net.Http.HttpClient(), dbMock.Object, new AzureAcsConfiguration
            {
                Url = new Uri("https://streamenergy-dev.accesscontrol.windows.net"),
                Realm = "https://streamenergy-dev.accesscontrol.windows.net",
                IdentityName = "portal-streamconnect-sa-dev",
                IdentityKey = "2xbcOGh+C+SPhXxsnzhrlN/uJ3QvStdh4WX8duu6MQ8="
            });

            using (var handler = new System.Net.Http.WebRequestHandler())
            {
                handler.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => { return certificate.GetSerialNumberString() == "60EC6D457B1F06A04361C20BD68EFDCA" || sslPolicyErrors == System.Net.Security.SslPolicyErrors.None; };

                using (var client = new System.Net.Http.HttpClient(handler))
                {
                    client.DefaultRequestHeaders.Authorization =  await target.GetAuthorization();

                    Assert.IsNotNull(client.DefaultRequestHeaders.Authorization);

                    var response = await client.GetAsync("https://streamconnect-test.cloudapp.net/api/UtilityProviders");
                    var responseString = await response.Content.ReadAsStringAsync();
                }
            }
        }
    }
}