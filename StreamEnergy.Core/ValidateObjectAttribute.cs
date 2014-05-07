using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Extensions;

namespace StreamEnergy
{
    public class ValidateObjectAttribute : ValidationAttribute
    {
        public ValidateObjectAttribute()
        {
            PrefixMembers = true;
        }

        public bool PrefixMembers { get; set; }
        public string ErrorMessagePrefix { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var results = new HashSet<ValidationResult>();
            var context = new ValidationContext(value);

            Validator.TryValidateObject(value, context, results, true);

            if (results.Count != 0)
            {
                return new CompositeValidationResult(from result in results.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                                     select new ValidationResult(result.ErrorMessage.Prefix(ErrorMessagePrefix),
                                                         from member in result.MemberNames
                                                         select PrefixMembers ? member.Prefix(validationContext.MemberName + ".") : member),
                    ErrorMessageString, new[] { validationContext.MemberName });
            }

            return ValidationResult.Success;
        }

    }
}
