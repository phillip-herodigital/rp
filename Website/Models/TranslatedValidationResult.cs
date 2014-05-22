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
    }
}