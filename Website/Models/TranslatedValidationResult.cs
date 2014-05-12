using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models
{
    public class TranslatedValidationResult
    {
        public string MemberName { get; set; }
        public string Text { get; set; }

        internal static IEnumerable<TranslatedValidationResult> Translate(IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> results, Sitecore.Data.Items.Item item, bool fallbackToFieldName = true)
        {
            return from val in results
                   let fieldName = val.ErrorMessage
                   let text = item[fieldName]
                   from member in val.MemberNames
                   select new TranslatedValidationResult
                   {
                       MemberName = member,
                       Text = (string.IsNullOrEmpty(text) && fallbackToFieldName) ? fieldName : text
                   };
        }
    }
}