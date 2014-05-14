using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Mvc;
using Sitecore.Mvc.Helpers;
using Sitecore.Resources.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public static IHtmlString ValidationAttributes<T, U>(this HtmlHelper<T> html, Expression<Func<T, U>> model, Item translateFrom = null)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();

            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            var prefix = StreamEnergy.CompositeValidationAttribute.GetPrefix(propertyChain);

            var metadata = ModelMetadata.FromLambdaExpression(model, html.ViewData);

            var clientRules = StreamEnergy.CompositeValidationAttribute.FilterClientRules(propertyChain, ModelValidatorProviders.Providers.GetValidators(metadata, html.ViewContext).SelectMany(v => v.GetClientValidationRules())).ToArray();
            foreach (var rule in clientRules)
            {
                rule.ErrorMessage = (prefix + rule.ErrorMessage).RenderFieldFrom(translateFrom ?? (Item)html.ViewBag.ValidationMessagesItem ?? html.Sitecore().CurrentItem, true);
            }

            var dictionary = new Dictionary<string, object>();
            UnobtrusiveValidationAttributesGenerator.GetValidationAttributes(clientRules, dictionary);
            dictionary["data-val-name"] = StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain);

            return html.Raw(string.Join(" ", from attr in dictionary
                                             select attr.Key + "=\"" + attr.Value + "\""));
        }

        public static IHtmlString ValidationErrorClass<T, U>(this HtmlHelper<T> html, Expression<Func<T, U>> model)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();
            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            return html.Raw("data-val-error=\"" + StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain) + "\"");
        }
    }
}
