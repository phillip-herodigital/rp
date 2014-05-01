using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Mvc;
using Sitecore.Mvc.Helpers;
using Sitecore.Resources.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.Sitecore
{
    public static class HtmlHelperExtensions
    {
        public static IHtmlString AsBackgroundStyle(this HtmlHelper htmlHelper, string fieldName, Item item = null)
        {
            item = item ?? htmlHelper.Sitecore().CurrentItem;

            var imageField = (ImageField)item.Fields[fieldName];
            if (imageField != null && imageField.MediaItem != null)
            {
                return htmlHelper.Raw("background-image: url('" + MediaManager.GetMediaUrl(imageField.MediaItem) + "')");
            }
            return htmlHelper.Raw("");
        }

        public static Item LookupItem(this SitecoreHelper sitecoreHelper, string fieldName)
        {
            var originalField = sitecoreHelper.CurrentItem.Fields[fieldName];
            if (originalField == null)
                return null;

            var field = (LookupField)originalField;
            if (field.TargetItem != null)
                return field.TargetItem;

            if (string.IsNullOrEmpty(originalField.Value))
                return null;

            var item = global::Sitecore.Context.Database.GetItem(originalField.Source + "/" + originalField.Value);
            return item;
        }

        public static string SafeFieldValue(this Item target, string fieldName)
        {
            if (target == null)
                return null;

            return target[fieldName];
        }

        public static StreamEnergyHelper MyStream(this HtmlHelper htmlHelper)
        {
            return new StreamEnergyHelper(htmlHelper);
        }

        /// <summary>
        /// Prepends a prefix if the target is not null or empty
        /// </summary>
        /// <param name="target">The target string in question</param>
        /// <param name="prefix">The prefix</param>
        /// <returns>The prefix and target, or the original target if it was null or empty</returns>
        public static string Prefix(this string target, string prefix)
        {
            if (!string.IsNullOrEmpty(target))
                return prefix + target;
            return target;
        }

        public static IHtmlString AsHtml(this string target)
        {
            return new HtmlString(target);
        }
    }
}
