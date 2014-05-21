using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public class ValidateEnumerableAttribute : CompositeValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                var memberName = validationContext.MemberName;
                var results = from entry in ((System.Collections.IEnumerable)value).OfType<object>().Select((obj, index) => new { obj, index })
                              let context = ((IValidationService)validationContext.GetService(typeof(IValidationService))).CreateValidationContext(entry.obj)
                              let innerResults = new HashSet<ValidationResult>()
                              where !Validator.TryValidateObject(entry.obj, context, innerResults, true)
                              from innerResult in innerResults.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true)
                              select Tuple.Create(memberName +  "[" + entry.index + "]", innerResult);

                return ResultFromInnerResults(results, memberName);
            }

            return ValidationResult.Success;
        }
    }
}
