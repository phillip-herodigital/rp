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
            if (IsAllBlank)
                return null;
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
            //var temp = new IgnoreBlanksModelBinder();
            var result = base.GetPropertyValue(controllerContext, bindingContext, propertyDescriptor, /*temp*/ propertyBinder);
            /*if (temp.IsAllBlank)
            {
                // the object is blank, so we should clear out child errors
                var ignoredKeys = bindingContext.ModelState.Keys.Where(k => k.StartsWith(bindingContext.ModelName)).ToArray();
                foreach (var key in ignoredKeys)
                {
                    bindingContext.ModelState[key].Errors.Clear();
                }
                return null;
            }
            else*/ if (result != null)
                IsAllBlank = false;
            return result;
        }
    }
}
