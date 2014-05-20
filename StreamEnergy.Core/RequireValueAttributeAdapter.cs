using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace StreamEnergy
{
    class RequireValueAttributeAdapter : DataAnnotationsModelValidator<RequireValueAttribute>
    {
        public RequireValueAttributeAdapter(ModelMetadata metadata, ControllerContext context, RequireValueAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            yield return new ModelClientValidationRule 
            { 
                ErrorMessage = base.ErrorMessage, 
                ValidationParameters = 
                { 
                    { "value", Json.Stringify(base.Attribute.Value) }
                },
                ValidationType = "exactvalue"
            };
        }
    }
}
