using Microsoft.Practices.Unity;
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
        private readonly IUnityContainer unityContainer;

        public ValidationService(IUnityContainer unityContainer)
        {
            this.unityContainer = unityContainer;
        }

        public IEnumerable<ValidationResult> CompleteValidate<T>(T target)
        {
            var validationContext = CreateValidationContext(target);
            var validations = new HashSet<ValidationResult>();

            Validator.TryValidateObject(target, validationContext, validations, true);

            return validations.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);
        }

        public IEnumerable<ValidationResult> PartialValidate<T>(T target, params Expression<Func<T, object>>[] validationExpressions)
        {
            var validationContext = CreateValidationContext(target);
            var validations = new List<ValidationResult>();
            foreach (var validationExpression in validationExpressions)
            {
                Func<IEnumerable<ValidationResult>> validate;
                Func<object> getValue = () => TryGetValue(validationExpression.CachedCompile<Func<T, object>>(), target);
                var unwrappedExpression = validationExpression.RemoveLambdaBody().RemoveCast();
                string messagePrefix;
                string memberPrefix;
                MemberExpression property;
                MemberInfo[] propertyChain;
                if (unwrappedExpression is MemberExpression)
                {
                    property = (unwrappedExpression as MemberExpression);
                    propertyChain = CompositeValidationAttribute.UnrollPropertyChain(property).ToArray();
                    messagePrefix = CompositeValidationAttribute.GetPrefix(propertyChain.Take(propertyChain.Length - 1));
                    memberPrefix = "";
                    validate = () =>
                        {
                            var name = CompositeValidationAttribute.GetPathedName(propertyChain);
                            var value = getValue();
                            var attrs = property.Member.GetCustomAttributes(true).OfType<ValidationAttribute>();
                            validationContext.MemberName = name;
                            var innerValidations = new HashSet<ValidationResult>();
                            Validator.TryValidateValue(value, validationContext, innerValidations, attrs);

                            return innerValidations;
                        };
                }
                else if (unwrappedExpression is MethodCallExpression && (unwrappedExpression as MethodCallExpression).Method.Name == "PartialValidate")
                {
                    property = (unwrappedExpression as MethodCallExpression).Arguments[0] as MemberExpression;
                    propertyChain = CompositeValidationAttribute.UnrollPropertyChain(property).ToArray();
                    messagePrefix = CompositeValidationAttribute.GetPrefix(propertyChain);
                    memberPrefix = CompositeValidationAttribute.GetPathedName(propertyChain);
                    validate = () => ((Func<IValidationService, IEnumerable<ValidationResult>>)getValue())(this);
                }
                else
                {
                    throw new NotSupportedException("Unsupported validation expression: " + validationExpression.ToString());
                }
                
                validations.AddRange(from v in validate().Flatten(v => v as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                     select new ValidationResult(v.ErrorMessage.Prefix(messagePrefix), v.MemberNames.Select(n => n.Prefix(memberPrefix)).ToArray()));
            }
            return validations.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);
        }

        public ValidationContext CreateValidationContext(object target)
        {
            var validationContext = new ValidationContext(target);
            validationContext.InitializeServiceProvider(t => unityContainer.Resolve(t));
            return validationContext;
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
