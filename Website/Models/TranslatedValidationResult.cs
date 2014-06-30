using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models
{
    [DebuggerDisplay("{MemberName}: {Text}")]
    public class TranslatedValidationResult
    {
        public string MemberName { get; set; }
        public string Text { get; set; }

        internal static IEnumerable<TranslatedValidationResult> Translate(IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> results, Sitecore.Data.Items.Item item, bool fallbackToFieldName = false)
        {
            return from val in results
                   let fieldName = val.ErrorMessage
                   from member in val.MemberNames
                   select new TranslatedValidationResult
                   {
                       MemberName = member,
                       Text = fieldName.RenderFieldFrom(item, fallbackToFieldName)
                   };
        }

        internal static IEnumerable<TranslatedValidationResult> Translate(System.Web.Http.ModelBinding.ModelStateDictionary modelState, Sitecore.Data.Items.Item item, bool fallbackToFieldName = false)
        {
            return from modelField in modelState
                   from System.Web.Http.ModelBinding.ModelError error in modelField.Value.Errors
                   where !string.IsNullOrEmpty(error.ErrorMessage)
                   select new TranslatedValidationResult
                   {
                       MemberName = modelField.Key.Split(".".ToCharArray(), 2).Skip(1).FirstOrDefault() ?? "",
                       Text = error.ErrorMessage.RenderFieldFrom(item, fallbackToFieldName),
                   };
        }
    }
}