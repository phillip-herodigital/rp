﻿using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.Extensions;
using ResponsivePath.Logging;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Documents;
using StreamEnergy.MyStream.Models.Marketing;
using Sitecore.Data.Items;
using Microsoft.VisualBasic.FileIO;
using System.Text.RegularExpressions;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/marketing")]
    public class MarketingController : ApiController, IRequiresSessionState
    {

        public MarketingController()
        {
            
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<HttpResponseMessage> Validas(ValidasRequest request)
        {
            using (var client = StreamEnergy.Unity.Container.Instance.Resolve<HttpClient>())
            {
                client.Timeout = TimeSpan.FromMilliseconds(10*60*1000); // Let this request stay open for a long time...

                var json = String.Format("\"LoginUsername\":\"{0}\",\"LoginPassword\":\"{1}\"," +
                                         "\"LoginChallenge\":\"{2}\",\"Carrier\":\"{3}\",\"DownloadBillHistory\":\"true\"," +
                                         "\"DownloadCurrentMonthBill\":\"false\",\"GetProfileDetails\":\"true\"," +
                                         "\"GetDeviceDetails\":\"true\",\"MaxBillingResults\":\"3\"",
                                         request.username, request.password, request.securityAnswer, request.carrier);
                json = "{" + json + "}";
                var sign = new System.Security.Cryptography.HMACSHA1(System.Text.Encoding.ASCII.GetBytes("6964220bb159b2728309dd7fb21ae886"));
                var result = sign.ComputeHash(System.Text.Encoding.ASCII.GetBytes(json));
                var signed = BitConverter.ToString(result).Replace("-", string.Empty);

                // Add a new Request Message
                var requestMessage = new HttpRequestMessage(HttpMethod.Post, "http://api10.savelovegive.com:3000/api/scrape/extract");

                // Add our custom headers
                requestMessage.Headers.Add("v-pk", "c3c35a59ac39157d074807d2123822e1");
                requestMessage.Headers.Add("v-sign", signed);

                // Set the JSON content
                var stringContent = new StringContent(json.ToString());
                requestMessage.Content = stringContent;

                // Send the request to the server and return response
                return await client.SendAsync(requestMessage);

            }
        }

        [HttpGet]
        [Route("getModal/{template}")]
        public ModalContent GetModalContent(string template)
        {
            Item modalTemplate = Sitecore.Context.Database.GetItem("/sitecore/content/Home/templates/modals/" + template);

            return new ModalContent()
            {
                Title = modalTemplate.Fields["Modal Title"].ToString(),
                Content = modalTemplate.Fields["Modal Content"].ToString(),
            };
        }

        [HttpGet]
        [Route("importinternationalrates")]
        public void ImportInternationalRates(string path)
        {
            TemplateItem folderTemplate = Sitecore.Context.Database.GetTemplate("Common/Folder");
            TemplateItem rateTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Taxonomy/Mobile Enrollment/International Rate");
            Item RatesFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/International Rates");
            Item countryItem;
            Item rateItem;

            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                // Empty the RatesFolder
                foreach (Item child in RatesFolder.Children)
                {
                    child.Delete();
                }

                TextFieldParser parser = new TextFieldParser(path);
                parser.TextFieldType = Microsoft.VisualBasic.FileIO.FieldType.Delimited;
                parser.SetDelimiters(",");

                while (!parser.EndOfData)
                {
                    string[] fields = parser.ReadFields();
                    string pattern = @"[^\w\s\-\$]"; // only allow \w, \s, -, and $ for Sitecore Item names
                    Regex rgx = new Regex(pattern);

                    string countryName = fields[0];
                    string countryPhone = fields[1];
                    string npa = fields[2];
                    string countryCode = fields[3];
                    string standardRate = fields[4];
                    string discountedRate = fields[5];
                    string countryItemName = rgx.Replace(countryName, "");
                    string countryPhoneItemName = rgx.Replace(countryPhone, "");

                    countryItem = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Mobile/International Rates/" + countryItemName);

                    if (countryItem == null)
                    {
                        // Create new folder from country name
                        countryItem = RatesFolder.Add(countryItemName, folderTemplate);
                    }

                    // Create new item from rate
                    rateItem = countryItem.Add(countryPhoneItemName, rateTemplate);

                    rateItem.Editing.BeginEdit();
                    rateItem.Fields["Country Phone Type"].Value = countryPhone;
                    rateItem.Fields["NPA"].Value = npa;
                    rateItem.Fields["Country Code"].Value = countryCode;
                    rateItem.Fields["Stream Standard Rate"].Value = standardRate;
                    rateItem.Fields["Stream Discounted Rate"].Value = discountedRate;
                    rateItem.Editing.EndEdit();

                }
                parser.Close();

            }

        }

    }
}