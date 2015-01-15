using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class KubraLoginHelper
    {
        const string uri = "https://secure3.i-doxs.net/StreamEnergy/Default.aspx?screenscrape=true";
        public async Task<bool> Login(Authentication.LoginRequest request)
        {
            using (var client = new HttpClient())
            {
                var formResult = await client.GetAsync(uri);
                string formContent = await formResult.Content.ReadAsStringAsync();

                var content = new Dictionary<string, string>
                {
                    { "__VIEWSTATE", GetFormValue(formContent, "__VIEWSTATE")                                       },
                    { "__PREVIOUSPAGE", GetFormValue(formContent, "__PREVIOUSPAGE")                                 },
                    { "__EVENTVALIDATION", GetFormValue(formContent, "__EVENTVALIDATION")                           },
                    { "_SubmitToken", GetFormValue(formContent, "_SubmitToken")                                     },
                    { "ctl00$Main$LoginBox$UserName", request.Username                                              },
                    { "ctl00$Main$LoginBox$Password", request.Password                                              },
                    { "ctl00$Main$LoginBox$btLogin", GetFormValue(formContent, "ctl00$Main$LoginBox$btLogin")       },
                    { "__ncforminfo", GetFormValue(formContent, "__ncforminfo")                                     },
                };
                var result = await client.PostAsync(uri, new FormUrlEncodedContent(content));
                string resultContent = await result.Content.ReadAsStringAsync();
                return !resultContent.Contains("UserName and Password combination is invalid. Access denied.");
            }
        }

        private static string GetFormValue(string content, string name)
        {
            var matches = Regex.Match(content, @"<input[^>]*name=""" + name.Replace("$", "\\$") + @"""[^>]* value=""([^""]*)""");

            return matches.Groups[1].Value;
        }
    }
}