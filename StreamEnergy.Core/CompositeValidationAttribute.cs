using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy
{
    public class CompositeValidationAttribute : ValidationAttribute
    {
        public CompositeValidationAttribute()
        {
            PrefixMembers = true;
        }

        public bool PrefixMembers { get; set; }
        public string ErrorMessagePrefix { get; set; }

        protected ValidationResult ResultFromInnerResults(IEnumerable<Tuple<string, ValidationResult>> innerResults, string memberName)
        {
            var results = from entry in innerResults
                          let result = entry.Item2
                          select new ValidationResult(result.ErrorMessage.Prefix(ErrorMessagePrefix),
                                                             (from member in result.MemberNames
                                                              select PrefixMembers ? member.Prefix(entry.Item1 + ".") : member).ToArray());

            results = results.ToArray();

            if (results.Any())
            {
                return new CompositeValidationResult(results, ErrorMessageString, new[] { memberName });
            }
            return ValidationResult.Success;
        }
    }
}
