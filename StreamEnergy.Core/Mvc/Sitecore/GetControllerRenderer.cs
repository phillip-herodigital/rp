using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Mvc.Sitecore
{
    class GetControllerRenderer : global::Sitecore.Mvc.Pipelines.Response.GetRenderer.GetControllerRenderer
    {
        protected override global::Sitecore.Mvc.Presentation.Renderer GetRenderer(global::Sitecore.Mvc.Presentation.Rendering rendering, global::Sitecore.Mvc.Pipelines.Response.GetRenderer.GetRendererArgs args)
        {
            Tuple<string, string> controllerAndAction = this.GetControllerAndAction(rendering, args);
            if (controllerAndAction == null)
            {
                return null;
            }
            return new ControllerRenderer
            {
                ControllerName = controllerAndAction.Item1,
                ActionName = controllerAndAction.Item2
            };
        }
    }
}
