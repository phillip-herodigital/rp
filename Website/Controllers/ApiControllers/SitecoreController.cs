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
                        let file = (MediaItem)(item.Fields["File"] != null ? ((FileField)item.Fields["File"]).MediaItem : null)
                        let thumbnail = (MediaItem)(item.Fields["Thumbnail"] != null ? ((ImageField)item.Fields["Thumbnail"]).MediaItem : null)
                        


                        select new
                        {
                            category = folder.Name,
                            subCategory = subfolder.Name,
                            type = file != null ? file.MimeType : null,
                            title = item.Fields["Title"].Value,
                            description = item.Fields["Description"].Value,
                            filesize = file != null ? file.Size : 0,
                            featured = item.Fields["Featured"].Value == "On",
                            size = item.Fields["Size"].Value,
                            modificationDate = file != null ? file.InnerItem.Statistics.Updated : DateTime.MinValue,
                            publicURL = file != null ? MediaManager.GetMediaUrl(file, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                            downloadURL = file != null ? MediaManager.GetMediaUrl(file, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                            thumbnailURL = thumbnail != null ? MediaManager.GetMediaUrl(thumbnail, new MediaUrlOptions { AlwaysIncludeServerUrl = true }) : null,
                        };
            return items.ToArray();
        }
    }
}
