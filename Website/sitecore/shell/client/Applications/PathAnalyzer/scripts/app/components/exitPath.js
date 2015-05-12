/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/scales.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/resources.js"], function (require, exports, EventManager, Scales, App, Resources) {
    "use strict";

    var ExitPath = (function () {
        function ExitPath(el, w, h) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.bus = new EventManager.Bus();
            this.setupSubscribers();
            this.numberFormat = d3.format("0,000");
        }
        ExitPath.prototype.off = function () {
            this.el.selectAll(".arrow").attr("fill", App.Settings.instance().DimColor);
            this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
            this.el.selectAll(".metrics").attr("opacity", "0");
        };

        ExitPath.prototype.on = function (exitcount, exitpotential) {
            this.el.selectAll(".arrow").attr("fill", App.Settings.instance().SelectedColor);
            this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", true);
            this.el.select("#exitCount").text(this.numberFormat(exitcount));
            this.el.select("#exitPotential").text(d3.round(exitpotential, 3));
            this.el.selectAll(".metrics").attr("opacity", "1");
        };

        ExitPath.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("node:mouseover", function (node, data) {
                if (node.next) {
                    self.off();
                    return;
                }

                var isExitingPath = data.parent && data.parent.__data__ && data.parent.__data__.isExit;
                if (isExitingPath) {
                    self.on(data.path.exitcount, data.path.exitpotential);
                } else {
                    self.off();
                }
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.el.selectAll(".arrow").attr("fill", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return App.Settings.instance().NoDetailsColor;
                    }
                    return Scales.getInstance().getEffiencyColor(d.averageExitingPathEfficiency);
                });

                self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);

                self.el.select("#exitCount").text(function (d) {
                    return self.numberFormat(this.parentNode.parentNode.parentNode.__data__.exitcount);
                });
                self.el.select("#exitPotential").text(function (d) {
                    return d3.round(this.parentNode.parentNode.parentNode.__data__.exitpotential, 3);
                });

                self.el.selectAll(".metrics").attr("opacity", "1");
            });

            this.bus.subscribe("exitpath:mouseover", function (node, data) {
                self.el.selectAll(".arrow").attr("fill", App.Settings.instance().SelectedColor);
                self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", true);
            });

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
                self.el.selectAll(".arrow").attr("fill", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return App.Settings.instance().NoDetailsColor;
                    }
                    return Scales.getInstance().getEffiencyColor(d.averageExitingPathEfficiency);
                });

                self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
            });

            this.bus.subscribe("reset", function (filter) {
                self.render();
            });
        };

        ExitPath.prototype.render = function () {
            this.el.selectAll(".exit").remove();
            var g = this.el.append('g').attr("class", "exit");

            var labelGroup = this.renderLabelGroup(g);
            this.renderLabels(labelGroup);
            this.renderMarker(labelGroup);
        };

        ExitPath.prototype.renderLabelGroup = function (group) {
            var self = this;
            var labelGroup = group.append('g').attr("class", "metricsLabelGroup").on("mouseover", function (d) {
                if (self.bus) {
                    self.bus.publish("exitpath:mouseover", d);
                }
            }).on("mouseout", function (d) {
                if (self.bus) {
                    self.bus.publish("exitpath:mouseout", d);
                }
            });

            return labelGroup;
        };

        ExitPath.prototype.renderLabels = function (group) {
            var _this = this;
            var format = this.numberFormat;
            group.append("text").attr("x", this.w / 2).attr("y", (this.h / 2) + 150).text(Resources.Strings.get("Exits")).attr("class", "metricsLabel metrics");

            group.append("text").attr("x", this.w / 2).attr("y", this.h / 2 + 175).text(function (d) {
                return format(this.parentNode.parentNode.parentNode.__data__.exitcount);
            }).attr("class", "metricsValue metrics").attr("id", "exitCount");

            group.append("text").attr("x", function (d, i) {
                return _this.w / 2;
            }).attr("y", function (d, i) {
                return (_this.h / 2) + 200;
            }).text(Resources.Strings.get("Exits Potential")).attr("class", "metricsLabel metrics");

            group.append("text").attr("x", function (d, i) {
                return _this.w / 2;
            }).attr("y", function (d, i) {
                return (_this.h / 2) + 225;
            }).text(function (d) {
                return d3.round(this.parentNode.parentNode.parentNode.__data__.exitpotential, 3);
            }).attr("class", "metricsValue metrics").attr("id", "exitPotential");
        };

        ExitPath.prototype.renderMarker = function (group) {
            // TODO: dynamic scale
            var x = d3.scale.linear().range([this.w / 2, this.w / 2]).domain([0, 1]);
            var y = d3.scale.linear().range([350, 350]).domain([0, 1]);

            var d = d3.svg.symbol().type('triangle-down').size(1000);

            group.append("path").attr("class", "arrow").attr("d", d).attr("width", 300).attr("transform", function (d) {
                return "translate(" + x(1) + "," + y(1) + ")";
            }).attr("fill", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.averageExitingPathEfficiency);
            });
        };
        return ExitPath;
    })();
    exports.ExitPath = ExitPath;
});
