using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    internal class ValidationService : IValidationService
    {
        public IEnumerable<ValidationResult> CompleteValidate<T>(T target)
        {
            var validationContext = new ValidationContext(target);
            var validations = new HashSet<ValidationResult>();

            Validator.TryValidateObject(target, validationContext, validations, true);

            return validations.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);
        }

        public IEnumerable<ValidationResult> PartialValidate<T>(T target, params Expression<Func<T, object>>[] properties)
        {
            var validationContext = new ValidationContext(target);
            var validations = new List<ValidationResult>();
            foreach (var property in from v in properties
                                     let property = (v.RemoveLambdaBody().RemoveCast() as MemberExpression)
                                     let propertyChain = CompositeValidationAttribute.UnrollPropertyChain(property).ToArray()
                                     select new
                                     {
                                         messagePrefix = CompositeValidationAttribute.GetPrefix(propertyChain.Take(propertyChain.Length - 1)),
                                         name = CompositeValidationAttribute.GetPathedName(propertyChain),
                                         value = TryGetValue(v.CachedCompile<Func<T, object>>(), target),
                                         attrs = property.Member.GetCustomAttributes(true).OfType<ValidationAttribute>()
                                     })
            {
                validationContext.MemberName = property.name;
                var innerValidations = new HashSet<ValidationResult>();
                Validator.TryValidateValue(property.value, validationContext, innerValidations, property.attrs);
                validations.AddRange(from v in innerValidations.Flatten(v => v as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                     select new ValidationResult(v.ErrorMessage.Prefix(property.messagePrefix), v.MemberNames));
            }
            return validations.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);
        }

        private object TryGetValue<T>(Func<T, object> func, T target)
        {
            try
            {
                return func(target);
            }
            catch
            {
                return null;
            }
        }

    }
}
