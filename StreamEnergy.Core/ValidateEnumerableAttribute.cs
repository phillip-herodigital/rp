using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Extensions;

namespace StreamEnergy
{
    public class ValidateEnumerableAttribute : ValidationAttribute
    {
        public ValidateEnumerableAttribute()
        {
            PrefixMembers = true;
        }

        public bool PrefixMembers { get; set; }
        public string ErrorMessagePrefix { get; set; }


        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var results = from entry in ((System.Collections.IEnumerable)value).OfType<object>().Select((obj, index) => new { obj, index })
                          let context = new ValidationContext(entry.obj)
                          let innerResults = new HashSet<ValidationResult>()
                          where !Validator.TryValidateObject(entry.obj, context, innerResults, true)
                          from result in innerResults.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true)
                          select new ValidationResult(result.ErrorMessage.Prefix(ErrorMessagePrefix),
                                                             from member in result.MemberNames
                                                             select PrefixMembers ? member.Prefix(validationContext.MemberName + "[" + entry.index + "]") : member);
            results = results.ToArray();

            if (results.Any())
            {
                return new CompositeValidationResult(results, ErrorMessageString, new[] { validationContext.MemberName });
            }

            return ValidationResult.Success;
        }

    }
}
