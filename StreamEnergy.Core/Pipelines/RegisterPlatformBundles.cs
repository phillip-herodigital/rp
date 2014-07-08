using Sitecore;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Optimization;

namespace StreamEnergy.Pipelines
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
            bundles.Add(new StyleBundle("~/frontend/assets/css/bundle")
                .Include("~/frontend/assets/css/*.css"));

            bundles.Add(CommonScripts(new ScriptBundle("~/frontend/assets/js/bundle")
                .Include("~/frontend/assets/js/libs/lodash/lodash.js")));
            bundles.Add(CommonScripts(new ScriptBundle("~/frontend/assets/js/legacybundle")
                .Include("~/frontend/assets/js/libs/lodash/lodash.compat.js")));
        }

        private Bundle CommonScripts(Bundle scriptBundle)
        {
            scriptBundle.Orderer = new NoChangeOrderer();

            return scriptBundle
                .Include("~/frontend/assets/js/libs/modernizr/modernizr.js")
                .Include("~/frontend/assets/js/libs/respond/dest/respond.min.js")
                .Include("~/frontend/assets/js/libs/jquery/dist/jquery.min.js")
                .IncludeDirectory("~/frontend/assets/js/vendor/", "*.js", true)
                .Include("~/frontend/assets/js/libs/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js")
                .Include("~/frontend/assets/js/libs/angular/angular.min.js")
                .Include("~/frontend/assets/js/libs/angular-bootstrap/ui-bootstrap-tpls.min.js")
                .Include("~/frontend/assets/js/libs/angular-ui-slider/src/slider.js")
                .Include("~/frontend/assets/js/app.js")
                .IncludeDirectory("~/frontend/assets/js/modules/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/providers/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/config/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/services/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/filters/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/directives/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/controllers/", "*.js", true);
        }
    }
}
