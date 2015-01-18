using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Text.RegularExpressions;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;
using Sitecore.Resources.Media;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class SitecoreAccessController : ApiController
    {
        public SitecoreAccessController()
        {
            
        }

        [HttpGet]
        public IEnumerable<dynamic> ElectronicToolkit()
        {
            var ElectronicToolkitFolder = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Electronic Toolkit");

            var items = from folder in ElectronicToolkitFolder.Children
                        from subfolder in folder.Children
                        from item in subfolder.Children
                        let itemType = item.TemplateID.ToString() == "{95C8BC9B-59FC-4A88-B36E-7AC4D77BD09B}" ? "File" : "Link"
                        let file = (MediaItem)(item.Fields["File"] != null ? ((FileField)item.Fields["File"]).MediaItem : null)
                        let fileUrl = file != null ? MediaManager.GetMediaUrl(file, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null
                        let fileModificationDate = file != null ? file.InnerItem.Statistics.Updated : DateTime.MinValue
                        let thumbnail = (MediaItem)(item.Fields["Thumbnail"] != null ? ((ImageField)item.Fields["Thumbnail"]).MediaItem : null)
                        let linkUrl = item.Fields["Link URL"] != null ? item.Fields["Link URL"].Value : null
                        let linkModificationDate = item != null ? item.Statistics.Updated : DateTime.MinValue

                        select new
                        {
                            category = folder.Name,
                            subCategory = subfolder.Name,
                            type = file != null ? file.MimeType : null,
                            title = item.Fields["Title"].Value,
                            description = item.Fields["Description"].Value,
                            filesize = file != null ? file.Size : 0,
                            featured = !String.IsNullOrEmpty(item.Fields["Featured"].Value),
                            size = item.Fields["Size"].Value,
                            modificationDate = itemType == "File" ? fileModificationDate : linkModificationDate,
                            publicURL = itemType == "File" ? fileUrl : linkUrl,
                            downloadURL = file != null ? MediaManager.GetMediaUrl(file, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                            thumbnailURL = thumbnail != null ? MediaManager.GetMediaUrl(thumbnail, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                        };
            return items.ToArray();
        }
    }
}
