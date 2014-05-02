using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sitecore.Mvc.Extensions;

namespace StreamEnergy.Mvc.Sitecore
{
    class ControllerRenderer : global::Sitecore.Mvc.Presentation.ControllerRenderer
    {
        public override void Render(System.IO.TextWriter writer)
        {
            string controllerName = this.ControllerName;
            string actionName = this.ActionName;
            if (controllerName.IsWhiteSpaceOrNull() || actionName.IsWhiteSpaceOrNull())
            {
                return;
            }
            ControllerRunner controllerRunner = new ControllerRunner(controllerName, actionName);
            string value = controllerRunner.Execute();
            if (value.IsEmptyOrNull())
            {
                return;
            }
            writer.Write(value);
        }
    }
}
