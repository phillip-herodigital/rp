/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/scales.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function (require, exports, Scales, App) {
    "use strict";

    var Ring = (function () {
        function Ring(el, w, h, radius) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.radius = radius;
        }
        Ring.prototype.render = function () {
            var _this = this;
            this.el.append("circle").attr("cx", function (d, i) {
                return _this.w / 2;
            }).attr("cy", function (d, i) {
                return _this.h / 2;
            }).attr("r", this.radius).style("stroke", App.Settings.instance().DimColor).style("stroke-width", 2).attr("fill", "#FFFFFF");
        };
        return Ring;
    })();
    exports.Ring = Ring;
});
