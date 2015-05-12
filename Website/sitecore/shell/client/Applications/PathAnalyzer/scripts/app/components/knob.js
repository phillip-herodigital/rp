/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require",
        "exports",
        "/-/speak/v1/pathanalyzer/scripts/app/scales.js",
        "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js",
        "/-/speak/v1/pathanalyzer/scripts/app/application.js"],
        function (require, exports, Scales, EventManager, App) {
    "use strict";

    var Knob = (function () {
        function Knob(el, w, h, radius, pageName) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.radius = radius;
            this.pageName = pageName;
            this.bus = new EventManager.Bus();
            this.setupSubscribers();
        }
        Knob.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("path:selected", function (node, data) {
                self.el.select(".back").style("opacity", "1");
            });

            this.bus.subscribe("reset", function (node, data) {
                self.el.select(".back").style("opacity", "0");
                self.el.select(".contacts").style("opacity", "0");
                self.off();
            });

            this.bus.subscribe("node:mouseover", function (node, data) {
                self.on();
            });

            this.bus.subscribe("exitpath:mouseover", function (node, data) {
                self.on();
            });

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
                self.off();
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.off();
            });
        };

        Knob.prototype.on = function () {
            var color = App.Settings.instance().SelectedColor;
            this.el.selectAll("circle").attr("stroke", color);
            this.el.select("#currentPage").classed("currentPageSelected", true);
        };

        Knob.prototype.off = function () {
            this.el.selectAll("circle").attr("stroke", null);
            this.el.select("#currentPage").classed("currentPageSelected", false);
        };

        Knob.prototype.render = function () {
            var _this = this;
            var self = this;

            this.el.append("circle").attr("cx", function () {
                return _this.w / 2;
            }).attr("cy", function () {
                return _this.h / 2;
            }).attr("r", this.radius).attr("stroke-width", 1).attr("stroke-dasharray", "5,5").attr("fill", "white");

            this.el.append("circle").attr("cx", function () {
                return _this.w / 2 - 60;
            }).attr("cy", function () {
                return _this.h / 2;
            }).attr("r", 18).attr("class", "back").on("click", function (d) {
                if (self.bus) {
                    App.AppState.pathSelected = false;
                    self.bus.publish("reset");
                }
            }).style("opacity", "0");

            this.el.append("text").attr("x", this.w / 2).attr("y", this.h / 2 - 43).text(function () {
                if (!self.pageName) {
                    return "";
                }
                if (self.pageName.length > 15)
                    return self.pageName.substring(0, 15) + "...";
                return self.pageName;
            }).attr("id", "currentPage");
        };
        return Knob;
    })();
    exports.Knob = Knob;
});
