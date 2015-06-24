using Sitecore.Data;
using Sitecore.Data.Items;
using Sitecore.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Providers
{
    public class MediaProvider : Sitecore.Resources.Media.MediaProvider
    {
        public override string GetMediaUrl(Sitecore.Data.Items.MediaItem item, Sitecore.Resources.Media.MediaUrlOptions options)
        {
            var returnUrl = base.GetMediaUrl(item, options);
            return returnUrl.Replace(" ", "%20");
        }
    }
}
