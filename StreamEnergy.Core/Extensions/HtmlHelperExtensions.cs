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

namespace StreamEnergy.Extensions
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

        public static StreamEnergyHelper MyStream(this HtmlHelper htmlHelper)
        {
            return new StreamEnergyHelper(htmlHelper);
        }

        public static string JsonStringify(this HtmlHelper htmlHelper, object target)
        {
            return Json.Stringify(target);
        }

        public static IHtmlString AsMoney(this HtmlHelper htmlHelper, string fieldName, Item item = null, int decimalPlaces = 2)
        {
            item = item ?? htmlHelper.Sitecore().CurrentItem;

            decimal value;
            if (item.Fields[fieldName] != null && !Sitecore.Context.PageMode.IsPageEditorEditing && decimal.TryParse(item.Fields[fieldName].Value, out value))
            {
                return htmlHelper.Raw(value.ToString("C" + decimalPlaces));
            }
            return htmlHelper.Sitecore().Field(fieldName, item);
        }
    }
}
