﻿using Sitecore;
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
                .Include("~/frontend/assets/css/global.css"));

            bundles.Add(new StyleBundle("~/frontend/assets/css/printbundle")
                .Include("~/frontend/assets/css/partials/print.css"));

            bundles.Add(CommonScripts(new ScriptBundle("~/frontend/assets/js/bundle")
                .Include("~/frontend/assets/js/libs/lodash/dist/lodash.js")));

            bundles.Add(CommonScripts(new ScriptBundle("~/frontend/assets/js/legacybundle")
                .Include("~/frontend/assets/js/libs/lodash/dist/lodash.compat.js")));
        }

        private Bundle CommonScripts(Bundle scriptBundle)
        {
            scriptBundle.Orderer = new NoChangeOrderer();

            return scriptBundle
                .IncludeDirectory("~/frontend/assets/js/polyfills/", "*.js", true)
                .Include("~/frontend/assets/js/libs/modernizr/modernizr.js")
                .Include("~/frontend/assets/js/libs/respond/dest/respond.min.js")
                .Include("~/frontend/assets/js/libs/jquery/dist/jquery.min.js")
                .IncludeDirectory("~/frontend/assets/js/vendor/", "*.js", true)
                .Include("~/frontend/assets/js/libs/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js")
                .Include("~/frontend/assets/js/libs/angular/angular.min.js")
                .Include("~/frontend/assets/js/libs/angular-scroll/angular-scroll.min.js")
                .Include("~/frontend/assets/js/libs/angular-bootstrap/ui-bootstrap-tpls.min.js")
                .Include("~/frontend/assets/js/libs/angular-ui-slider/src/slider.js")
                .Include("~/frontend/assets/js/libs/angular-google-maps/dist/angular-google-maps.js")
                .Include("~/frontend/assets/js/libs/d3/d3.js")
                .Include("~/frontend/assets/js/libs/d3/line-chart.js")
                .Include("~/frontend/assets/js/app.js")
                .Include("~/Scripts/angular.unobtrusive.validation.min.js")
                .Include("~/frontend/assets/js/libs/jSignature/jSignature.min.noconflict.js")
                .Include("~/frontend/assets/js/libs/isotope/isotope.pkgd.min.js")
                .Include("~/frontend/assets/js/libs/jquery-dotdotdot/jquery.dotdotdot.min.js")
                .Include("~/frontend/assets/js/libs/jquery-calendario/jquery.calendario.min.js")
                .IncludeDirectory("~/frontend/assets/js/modules/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/config/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/services/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/filters/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/directives/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/controllers/", "*.js", true);
        }
    }
}
