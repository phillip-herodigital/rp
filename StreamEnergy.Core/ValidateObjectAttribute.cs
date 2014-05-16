using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Extensions;

namespace StreamEnergy
{
    public class ValidateObjectAttribute : CompositeValidationAttribute
    {

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                var results = new HashSet<ValidationResult>();
                var context = new ValidationContext(value);

                Validator.TryValidateObject(value, context, results, true);

                if (results.Count != 0)
                {
                    var memberName = validationContext.MemberName;

                    return ResultFromInnerResults(from result in results.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                                  select Tuple.Create(memberName, result), memberName);
                }
            }

            return ValidationResult.Success;
        }

    }
}
