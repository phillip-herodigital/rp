using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using StreamEnergy.Extensions;

namespace StreamEnergy.Mvc.Sitecore
{
    class SitecoreTranslatingModelValidatorProvider : ModelValidatorProvider
    {
        private readonly ModelValidatorProvider[] providers;

        public SitecoreTranslatingModelValidatorProvider(ModelValidatorProvider[] providers)
        {
            this.providers = providers;
        }

        public override IEnumerable<ModelValidator> GetValidators(ModelMetadata metadata, ControllerContext context)
        {
            var prefix = "";
            if (metadata.AdditionalValues.ContainsKey("validator prefix"))
            {
                prefix = metadata.AdditionalValues["validator prefix"].ToString();
            }
            return from provider in providers
                   from validator in provider.GetValidators(metadata, context)
                   select new TranslatedModelValidator(metadata, context, validator, prefix);
        }


        class TranslatedModelValidator : ModelValidator
        {
            private ModelValidator validator;
            private string prefix;

            public TranslatedModelValidator(ModelMetadata metadata, ControllerContext controllerContext, ModelValidator validator, string prefix)
                : base(metadata, controllerContext)
            {
                this.validator = validator;
                this.prefix = prefix;
            }

            public override bool IsRequired
            {
                get
                {
                    return validator.IsRequired;
                }
            }
            public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
            {
                return from rule in validator.GetClientValidationRules()
                       select TranslateRule(rule);
            }
            public override IEnumerable<ModelValidationResult> Validate(object container)
            {
                return from result in validator.Validate(container)
                       select TranslateResult(result);
            }

            private ModelValidationResult TranslateResult(ModelValidationResult result)
            {
                result.Message = Translate(result.Message);
                return result;
            }

            internal ModelClientValidationRule TranslateRule(ModelClientValidationRule rule)
            {
                rule.ErrorMessage = Translate(rule.ErrorMessage);
                return rule;
            }

            private string Translate(string original)
            {
                return ControllerContext.HttpContext.Server.HtmlEncode((prefix + original).RenderFieldFrom(global::Sitecore.Context.Item, false));
            }
        }
    }
}
