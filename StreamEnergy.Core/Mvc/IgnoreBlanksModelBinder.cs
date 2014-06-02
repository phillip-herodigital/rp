using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;

namespace StreamEnergy.Mvc
{
    public class IgnoreBlanksModelBinder : DefaultModelBinder
    {
        private bool IsAllBlank { get; set; }

        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var result = base.BindModel(controllerContext, bindingContext);
            if (IsAllBlank && !bindingContext.ModelMetadata.IsRequired)
            {
                foreach (var modelKey in bindingContext.ModelState.Keys.Where(k => k.StartsWith(bindingContext.ModelName)))
                {
                    bindingContext.ModelState[modelKey].Errors.Clear();
                }
                return null;
            }
            return result;
        }

        protected override object CreateModel(ControllerContext controllerContext, ModelBindingContext bindingContext, Type modelType)
        {
            IsAllBlank = true;
            var result = base.CreateModel(controllerContext, bindingContext, modelType);
            return result;
        }

        protected override object GetPropertyValue(ControllerContext controllerContext, ModelBindingContext bindingContext, System.ComponentModel.PropertyDescriptor propertyDescriptor, IModelBinder propertyBinder)
        {
            var result = base.GetPropertyValue(controllerContext, bindingContext, propertyDescriptor, /*temp*/ propertyBinder);
            if (result != null)
                IsAllBlank = false;
            return result;
        }
    }
}
