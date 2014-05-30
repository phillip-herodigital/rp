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
        private static ISettings settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
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

        public static IHtmlString For<T, U>(this HtmlHelper<T> html, Expression<Func<T, U>> model)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();
            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            return html.Raw(StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain));
        }

        public static IHtmlString ValidationAttributes<T, U>(this HtmlHelper<T> html, Expression<Func<T, U>> model, Item translateFrom = null, bool writeId = true, bool writeValue = true)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();

            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            var prefix = StreamEnergy.CompositeValidationAttribute.GetPrefix(propertyChain);

            var metadata = ModelMetadata.FromLambdaExpression(model, html.ViewData);

            var clientRules = (from validator in ModelValidatorProviders.Providers.GetValidators(metadata, html.ViewContext)
                               from rule in validator.GetClientValidationRules()
                               let name = (prefix + rule.ErrorMessage)
                               select TranslateRule(html, rule, name, translateFrom, true)).ToArray();

            var dictionary = new Dictionary<string, object>();
            UnobtrusiveValidationAttributesGenerator.GetValidationAttributes(clientRules, dictionary);
            dictionary["name"] = StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain);
            if (writeId)
            {
                dictionary["id"] = StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain);
            }
            if (writeValue)
            {
                dictionary["data-value"] = System.Web.Mvc.Html.ValueExtensions.ValueFor(html, model);
            }

            return html.Raw(string.Join(" ", from attr in dictionary
                                             select attr.Key + "=\"" + attr.Value + "\""));
        }

        private static ModelClientValidationRule TranslateRule<T>(this HtmlHelper<T> html, ModelClientValidationRule rule, string name, Item translateFrom, bool encode)
        {
            rule.ErrorMessage = name.RenderFieldFrom(translateFrom ?? (Item)html.ViewBag.ValidationMessagesItem ?? html.Sitecore().CurrentItem, false);
            if (encode)
                rule.ErrorMessage = html.Encode(rule.ErrorMessage);
            return rule;
        }

        public static IHtmlString ValidationErrorClass<T, U>(this HtmlHelper<T> html, Expression<Func<T, U>> model)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();
            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            return html.Raw("data-val-error=\"" + StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain) + "\"");
        }

        public static IHtmlString AllValidationMessagesFor<T, U>(this HtmlHelper<T> html, Expression<Func<T, U>> model, Item translateFrom = null)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();

            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            var basePrefix = StreamEnergy.CompositeValidationAttribute.GetPrefix(propertyChain);

            var allMetaData = new[] 
            { 
                new { propertyChain, metadata = ModelMetadata.FromLambdaExpression(model, html.ViewData) } 
            }.Flatten(m => from property in m.metadata.Properties
                           let propertyInfo = m.metadata.ModelType.GetProperty(property.PropertyName)
                           // Keeps us from delving into properties like String.Length
                           where propertyInfo.DeclaringType.Namespace.StartsWith("StreamEnergy")
                           select new { propertyChain = m.propertyChain.Concat(new[] { propertyInfo }), metadata = property }, false);

            var clientRules = (from entry in allMetaData
                               from validator in ModelValidatorProviders.Providers.GetValidators(entry.metadata, html.ViewContext)
                               from rule in validator.GetClientValidationRules()
                               let name = (StreamEnergy.CompositeValidationAttribute.GetPrefix(entry.propertyChain) + rule.ErrorMessage)
                               let path = StreamEnergy.CompositeValidationAttribute.GetPathedName(entry.propertyChain)
                               select new { name, path, rule = TranslateRule(html, rule, name, translateFrom, false).ErrorMessage }).ToArray();

            return html.Raw(string.Join("<br/>", from rule in clientRules
                                                 select rule.name + " (" + rule.path + ") &mdash; " + rule.rule));
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

        public static string TranslateDomain(this HtmlHelper htmlHelper, string domain)
        {
            var domains = settings.GetDomainTranslations();

            if (domains.ContainsKey(domain))
            {
                return domains[domain];
            }
            return domain;
        }
    }
}
