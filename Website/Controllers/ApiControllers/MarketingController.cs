using System;
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
using System.Text.RegularExpressions;
using Microsoft.VisualBasic.FileIO;

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
        [Route("importvoicefaqdata")]
        public void ImportVoiceFAQData(string path)
        {
            Item FAQFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Home/services/home-services/voice/faqs");
            TemplateItem FAQGroupTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Components/Marketing/FAQ Group");
            TemplateItem FAQTemplate = Sitecore.Context.Database.GetTemplate("User Defined/Components/Marketing/FAQ");
            Item FAQGroupItem;
            Item FAQItem;

            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                foreach (Item child in FAQFolder.Children)
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
                    string faqGroup = fields[0];
                    string faqGroupItemName = rgx.Replace(faqGroup, "");

                    FAQGroupItem = Sitecore.Context.Database.GetItem("/sitecore/content/Home/services/home-services/voice/faqs/" + faqGroupItemName);
                    if (FAQGroupItem == null)
                    {
                        FAQGroupItem = FAQFolder.Add(faqGroupItemName, FAQGroupTemplate);
                        FAQGroupItem.Editing.BeginEdit();
                        FAQGroupItem.Fields["Name"].Value = faqGroup;
                        FAQGroupItem.Editing.EndEdit();
                    }

                    int sortOrder = Convert.ToInt16(fields[1]);
                    string faqQuestion = fields[2];
                    string faqAnswer = fields[3];
                    string faqQuestionItemName = rgx.Replace(faqQuestion, "");

                    FAQItem = Sitecore.Context.Database.GetItem("/sitecore/content/home/services/home-services/voice/faqs/" + faqGroupItemName + "/" + faqQuestionItemName);
                    if (FAQItem == null)
                    {
                        FAQItem = FAQGroupItem.Add(faqQuestionItemName, FAQTemplate);
                        FAQItem.Editing.BeginEdit();
                        FAQItem.Fields["FAQ Question"].Value = faqQuestion;
                        FAQItem.Fields["FAQ Answer"].Value = faqAnswer;
                        FAQItem.Appearance.Sortorder = sortOrder;
                        FAQItem.Editing.EndEdit();
                    }
                }
                parser.Close();
            }
        }

    }
}