using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.Routing;

namespace StreamEnergy.Mvc.Sitecore
{
    class ControllerRunner : global::Sitecore.Mvc.Controllers.ControllerRunner
    {
        private RequestContext requestContext;
        public ControllerRunner(string controllerName, string actionName) : base(controllerName, actionName)
        {
        }

        protected override IController CreateController()
        {
            NeedRelease = true;
            return ControllerBuilder.Current.GetControllerFactory().CreateController(requestContext, ControllerName);
        }

        public override string Execute()
        {
            System.IO.StringWriter outputWriter = new System.IO.StringWriter();
            var original = global::Sitecore.Mvc.Presentation.PageContext.Current.RequestContext;
            requestContext = new RequestContext(original.HttpContext.CreateHttpContextProxy(outputWriter), new RouteData
            {
                Values = { { "controller", this.ActualControllerName }, { "action", this.ActionName } }
            });

            IController controller = this.CreateController();

            try
            {
                this.ExecuteController(controller);
            }
            finally
            {
                this.ReleaseController(controller);
            }

            return outputWriter.ToString();
        }
        
        protected virtual void ReleaseController(IController controller)
        {
            if (!this.NeedRelease)
            {
                return;
            }
            ControllerBuilder.Current.GetControllerFactory().ReleaseController(controller);
        }

        protected virtual void ExecuteController(IController controller)
        {
            controller.Execute(requestContext);
        }

    }
}
