using Sitecore;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Optimization;

namespace StreamEnergy.Sitecore
{
    public class RegisterPlatformBundles
    {
        [UsedImplicitly]
        public virtual void Process(PipelineArgs args)
        {
            RegisterBundles(BundleTable.Bundles);
        }

        private void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/Styles")
                .Include("~/frontend/assets/css/*.css"));

            bundles.Add(new ScriptBundle("~/bundles/Scripts")
                .Include("~/frontend/assets/js/libs/modernizr/modernizr.js")
                .Include("~/frontend/assets/js/libs/angular/angular.min.js")
                .Include("~/frontend/assets/js/libs/angular-bootstrap/ui-bootstrap-tpls.min.js")
                .Include("~/frontend/assets/js/libs/angular-ui-utils/ui-utils.min.js")
                .Include("~/frontend/assets/js/app.js")
                .IncludeDirectory("~/frontend/assets/js/filters/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/directives/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/controllers/", "*.js", true));
        }
    }
}
