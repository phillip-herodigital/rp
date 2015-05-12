/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/utils/helpers.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/components/icon.js", "/-/speak/v1/pathanalyzer/scripts/app/components/landingPath.js", "/-/speak/v1/pathanalyzer/scripts/app/components/exitPath.js", "/-/speak/v1/pathanalyzer/scripts/app/components/pathSequence.js", "/-/speak/v1/pathanalyzer/scripts/app/components/knob.js", "/-/speak/v1/pathanalyzer/scripts/app/components/ring.js"], function(require, exports, Helpers, EventManager, IconComponent, LandingPathComponent, ExitPathComponent, PathSequenceComponent, KnobComponent, RingComponent) {
    var Spider = (function () {
        function Spider(el, w, h, pageName) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.pageName = pageName;
            this.bus = new EventManager.Bus();
        }
        Spider.prototype.render = function () {
            var generator = new Helpers.EntryPathGenerator(this.w, this.h);

            // order important
            var pathGroupClass = "pathgroup";
            var ringGroup = this.el.append("g").attr("id", "ring");
            var pathGroup = this.el.append("g").attr("id", "paths").classed(pathGroupClass, true);
            var landingPathGroup = this.el.append("g").attr("id", "landingPath").classed(pathGroupClass, true);
            var exitPathGroup = this.el.append("g").attr("id", "exitPath").classed(pathGroupClass, true);

            var knobGroup = this.el.append("g").attr("id", "knob");
            var iconGroup = this.el.append("g").attr("id", "icon");

            var icon = new IconComponent.Icon(iconGroup, this.w, this.h, 55, 60);
            icon.render();

            var knob = new KnobComponent.Knob(knobGroup, this.w, this.h, 90, this.pageName);
            knob.render();

            var ring = new RingComponent.Ring(ringGroup, this.w, this.h, 120);
            ring.render();

            var pathSequence = new PathSequenceComponent.PathSequence(pathGroup, this.w, this.h);
            pathSequence.render();

            var landingPath = new LandingPathComponent.LandingPath(landingPathGroup, this.w, this.h);
            landingPath.render();

            var exitPath = new ExitPathComponent.ExitPath(exitPathGroup, this.w, this.h);
            exitPath.render();
        };
        return Spider;
    })();
    exports.Spider = Spider;
});
