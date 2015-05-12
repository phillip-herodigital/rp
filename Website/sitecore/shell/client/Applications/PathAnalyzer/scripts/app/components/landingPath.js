/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require",
    "exports",
    "/-/speak/v1/pathanalyzer/scripts/app/models.js",
    "/-/speak/v1/pathanalyzer/scripts/app/utils/helpers.js",
    "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js",
    "/-/speak/v1/pathanalyzer/scripts/app/scales.js",
    "/-/speak/v1/pathanalyzer/scripts/app/components/nextNodes.js",
     "/-/speak/v1/pathanalyzer/scripts/app/components/nextNodeLabels.js",
    "/-/speak/v1/pathanalyzer/scripts/app/application.js",
    "/-/speak/v1/pathanalyzer/scripts/app/utils/resources.js"],
    function (require, exports, Models, Helpers, EventManager, Scales, NextNodes, NextNodeLabels, App, Resources) {
    "use strict";

    var LandingPath = (function () {
        function LandingPath(el, w, h) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.bus = new EventManager.Bus();
            this.numberFormat = d3.format("0,000");
            this.midPadding = App.Settings.instance().midPadding;
            this.setupSubscribers();
        }
        LandingPath.prototype.render = function () {
            var data = this.el[0][0].__data__;
            this.update(data.paths);
        };

        LandingPath.prototype.update = function (paths) {
            paths = Models.Filter.getInstance().process(paths);
            this.nextNodes = d3.merge(paths.map(function (p) {
                if (App.AppState.instance().highLevelEntryEnabled())
                    return p.next.slice(0, 2);
                return p.next;
            }));
            var landingPaths = paths.filter(function (d) {
                return d.isLanding;
            });

            if (landingPaths.length > 0) {
                this.color = Scales.getInstance().getEffiencyColor(landingPaths[0].efficiency);
                var g = this.renderGroup(landingPaths);
                var labelGroup = this.renderLabelGroup(g);
                this.renderLabels(labelGroup, true);
                this.renderMarker(labelGroup);
                this.renderNextPaths(g);
            } else {
                var g = this.renderGroup(landingPaths);
                var labelGroup = this.renderLabelGroup(g);
                this.renderLabels(labelGroup, false);
            }
        };

        LandingPath.prototype.renderGroup = function (landingPaths) {
            var g = this.el.selectAll(".landing").data(landingPaths);

            g.selectAll("path").remove();
            g.selectAll("circle").remove();
            g.selectAll(".metricsLabelGroup").remove();

            g.enter().append('g').attr("class", "landing");

            g.exit().remove();

            return g;
        };

        LandingPath.prototype.renderLabelGroup = function (group) {
            var self = this;
            var labelGroup = group.selectAll("g").data(function (d) {
                return d.previous;
            });

            labelGroup.enter().append('g').attr("class", "metricsLabelGroup").attr("id", "arrowGroup").on("click", function (d) {
                if (self.bus) {
                    self.bus.publish("path:selected", d, { el: this, path: this.parentNode.__data__ });
                }
            }).on("mouseover", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseover", d, { el: this, path: this.parentNode.__data__, parent: this.parentNode });
                }
            }).on("mouseout", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseout", d, { el: this, path: this.parentNode.__data__, parent: this.parentNode });
                }
            });

            labelGroup.exit().remove();

            return labelGroup;
        };

        LandingPath.prototype.renderNextPaths = function (group) {
            var lineMaker = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("linear");

            var self = this;
            var strokeScale = Scales.getInstance().strokeScale;
            var generator = Helpers.EntryPathGenerator.getInstance();

            var nextPaths = group.selectAll(".nextPath").data(function (d) {
                if (App.AppState.instance().highLevelEntryEnabled())
                    return d.next.slice(0, 2);
                return d.next;
            });

            nextPaths.enter().append("svg:path").attr("id", function (d) {
                return "exitpath" + d.id;
            }).attr("d", function (d, i) {
                var index = Helpers.ArrayHelper.findIndex(self.nextNodes, d.id);
                return lineMaker(generator.generateExit(index, self.nextNodes.length));
            }).attr("stroke", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
            }).attr("stroke-width", function (d) {
                if (App.AppState.instance().highLevelExitEnabled()) {
                    return 2;
                }
                return strokeScale(d.visits);
            }).attr("fill", "none").attr("class", "nextPath").on("click", function (d) {
                if (self.bus) {
                    self.bus.publish("path:selected", d, { el: this, path: this.parentNode.__data__ });
                }
            }).on("mouseover", function (d, i) {
                if (self.bus) {
                    self.bus.publish("node:mouseover", d, { el: this.parentNode, path: this.parentNode.__data__ });
                }
            }).on("mouseout", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseout", d, { el: this, path: this.parentNode.__data__ });
                }
            });
            nextPaths.exit().remove();

            new NextNodes(group, this.nextNodes).render();
            new NextNodeLabels(group, this.nextNodes).render();
        };

        LandingPath.prototype.renderLabels = function (group, hasLandings) {
            var self = this;

            if (!hasLandings) {
                group.append("text").attr("x", this.w / 2).attr("y", this.h / 2 - 165).text(Resources.Strings.get("No Landings")).attr("class", "metricsValue metrics");
            } else {
                group.append("text").attr("x", this.w / 2).attr("y", this.h / 2 - 165).text(Resources.Strings.get("Landings")).attr("class", "metricsLabel metrics");
                group.append("text").attr("x", this.w / 2).attr("y", this.h / 2 - 140).text(function (d) {
                    return self.numberFormat(this.parentNode.parentNode.parentNode.__data__.landing);
                }).attr("id", "landingMetricsValue").attr("class", "metricsValue metrics");
            }
        };

        LandingPath.prototype.renderMarker = function (group) {
            // TODO: dynamic scale
            var x = d3.scale.linear().range([this.w / 2, this.w / 2]).domain([0, 1]);
            var y = d3.scale.linear().range([145, 145]).domain([0, 1]);
            var d = d3.svg.symbol().type('triangle-down').size(500);
            var self = this;
            group.append("path").attr("class", "arrow").attr("d", d).attr("transform", function (d) {
                return "translate(" + x(1) + "," + y(1) + ")";
            }).attr("fill", function () {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                return self.color;
            });
        };

        LandingPath.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("exitpath:mouseover", function (node, data) {
                self.off();
            });

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
                self.reset();
            });

            this.bus.subscribe("data:updated", function (newData) {
                self.render();
            });

            this.bus.subscribe("reset", function (filter) {
                self.render();
            });

            this.bus.subscribe("sort:changed", function (sort) {
                self.render();
            });

            this.bus.subscribe("node:mouseover", function (node, data) {
                if (data.path.isLanding) {
                    self.on(node);
                    self.el.select("#landingMetricsValue").text(self.numberFormat(node.visits));
                } else {
                    self.off();
                }
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.reset();
            });
        };

        LandingPath.prototype.off = function () {
            this.el.selectAll(".arrow").attr("fill", App.Settings.instance().DimColor);
            this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
            this.el.selectAll(".nextPath").attr("stroke", App.Settings.instance().DimColor);
            this.el.selectAll(".metrics").attr("opacity", "0");
        };

        LandingPath.prototype.on = function (activationNode) {
            this.el.selectAll(".arrow").attr("fill", App.Settings.instance().SelectedColor);
            this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", true);
            this.el.selectAll(".metrics").attr("opacity", "1");

            if (activationNode.next) {
                this.el.selectAll(".nextPath").attr("stroke", App.Settings.instance().DimColor);
                var exitPathId = "#exitpath" + activationNode.id;
                this.el.selectAll(exitPathId).attr("stroke", App.Settings.instance().SelectedColor);
            } else {
                this.el.selectAll(".nextPath").attr("stroke", App.Settings.instance().SelectedColor);
            }
        };

        LandingPath.prototype.reset = function () {
            var self = this;

            self.el.selectAll(".arrow").attr("fill", function () {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                return self.color;
            });

            self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
            self.el.selectAll(".metrics").attr("opacity", "1");

            self.el.selectAll(".nextPath").attr("stroke", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
            });

            self.el.select("#landingMetricsValue").text(function (d) {
                return self.numberFormat(this.parentNode.parentNode.parentNode.__data__.landing);
            });
        };
        return LandingPath;
    })();
    exports.LandingPath = LandingPath;
});
