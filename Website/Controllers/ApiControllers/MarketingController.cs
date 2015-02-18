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
using StreamEnergy.Logging;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Documents;
using StreamEnergy.MyStream.Models.Marketing;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;
using Sitecore.Resources.Media;

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
        [Route("getVideo/{videoId}")]
        public dynamic getVideo(string videoId)
        {
            var videoGuid = new Guid(videoId);
            var video = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID(videoGuid));
            var itemType = video.TemplateID.ToString() == "{95C8BC9B-59FC-4A88-B36E-7AC4D77BD09B}" ? "File" : "Link";
            var file = (MediaItem)(video.Fields["File"] != null ? ((FileField)video.Fields["File"]).MediaItem : null);
            var fileUrl = file != null ? MediaManager.GetMediaUrl(file, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null;
            var fileModificationDate = file != null ? file.InnerItem.Statistics.Updated : DateTime.MinValue;
            var thumbnail = (MediaItem)(video.Fields["Thumbnail"] != null ? ((ImageField)video.Fields["Thumbnail"]).MediaItem : null);
            var linkUrl = video.Fields["Link URL"] != null ? video.Fields["Link URL"].Value : null;

            return new
                        {
                            category = video.Parent.Parent.Name,
                            subCategory = video.Parent.Name,
                            type = file != null ? file.MimeType : null,
                            title = video.Fields["Title"].Value,
                            description = video.Fields["Description"].Value,
                            filesize = file != null ? file.Size : 0,
                            featured = !String.IsNullOrEmpty(video.Fields["Featured"].Value),
                            size = video.Fields["Size"].Value,
                            modificationDate = fileModificationDate,
                            publicURL = itemType == "File" ? fileUrl : linkUrl,
                            downloadURL = file != null ? MediaManager.GetMediaUrl(file, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                            thumbnailURL = thumbnail != null ? MediaManager.GetMediaUrl(thumbnail, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                            youtubeId = video.Fields["Youtube ID"].Value,
                        };
        }

        
    }
}