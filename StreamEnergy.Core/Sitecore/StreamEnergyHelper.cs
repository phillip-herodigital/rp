using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Mvc;
using Sitecore.Mvc.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace StreamEnergy.Sitecore
{
    public class StreamEnergyHelper
    {
        private System.Web.Mvc.HtmlHelper htmlHelper;

        public StreamEnergyHelper(System.Web.Mvc.HtmlHelper htmlHelper)
        {
            this.htmlHelper = htmlHelper;
        }

        /// <summary>
        /// Looks up a field on the current item that links to another item. Provided that other item exists, uses the `referencedFieldName` to look up another field and returns that value as a string.
        /// 
        /// Example: Get a field of the item chosen by a dropdown list on current item.
        /// </summary>
        /// <param name="fieldName">The lookup field on the current item</param>
        /// <param name="referencedFieldName">The field on the referenced item</param>
        /// <param name="prefix">A prefix, if any, to append to the value</param>
        /// <returns>An html string containing the value</returns>
        public IHtmlString LookupReferencedFieldValue(string fieldName, string referencedFieldName, string prefix = null)
        {
            var referencedField = LookupReferencedField(fieldName, referencedFieldName);
            if (referencedField == null || string.IsNullOrEmpty(referencedField.Value))
                return htmlHelper.Raw("");
            return htmlHelper.Raw((prefix ?? "") + referencedField.Value);
        }

        /// <summary>
        /// Looks up a field on the current item that links to another item. Provided that other item exists, uses the `referencedFieldName` to look up another field and returns that value.
        /// </summary>
        /// <param name="fieldName">The lookup field on the current item</param>
        /// <param name="referencedFieldName">The field on the referenced item</param>
        /// <returns>The Sitecore field, if it exists.</returns>
        public Field LookupReferencedField(string fieldName, string referencedFieldName)
        {
            var sitecoreHelper = htmlHelper.Sitecore();
            var targetItem = sitecoreHelper.Lookup(fieldName);
            if (targetItem == null)
                return null;

            return targetItem.Fields[referencedFieldName];
        }
    }
}
