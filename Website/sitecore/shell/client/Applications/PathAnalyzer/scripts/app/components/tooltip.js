/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/resources.js"], function (require, exports, EventManager, App, Resources) {
    "use strict";

    var Tooltip = (function () {
        function Tooltip(el, cssClass, opacity) {
            if (typeof cssClass === "undefined") { cssClass = "tooltip"; }
            if (typeof opacity === "undefined") { opacity = 0; }
            this.el = el;
            this.cssClass = cssClass;
            this.opacity = opacity;
            this.bus = new EventManager.Bus();
            this.setupSubscribers();
        }
        Tooltip.prototype.render = function () {
            this.el.append("div").attr("class", this.cssClass).style("opacity", this.opacity);
        };

        Tooltip.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("node:mouseover", function (node, data) {
                if (App.AppState.pathSelected) {
                    var isOnSelected = d3.select(data.el).classed("selected");
                    if (!isOnSelected) {
                        return;
                    }
                }

                if (data.parent && data.isNode) {
                    var tooltip = d3.selectAll(".tooltip");
                    if (tooltip) {
                        tooltip.transition().duration(200).style("opacity", .9);
                        tooltip.html("<strong>" + node.name + "</strong><br/><span class='url'>" + node.url + "</span><br/>" + Resources.Strings.get("Value") + ": " + node.value + "<br/>" + Resources.Strings.get("Visits") +": " + node.visits).style("left", (d3.event.clientX - 75) + "px").style("top", (d3.event.clientY) + "px");
                    }
                }
            }, true);

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.off();
            }, true);

            this.bus.subscribe("path:selected", function (node) {
                self.off();
            });
        };

        Tooltip.prototype.off = function () {
            var tooltip = d3.selectAll(".tooltip");
                if (tooltip) {
                    tooltip.transition().duration(500).style("opacity", 0);
                }
        };
        return Tooltip;
    })();
    exports.Tooltip = Tooltip;
});
