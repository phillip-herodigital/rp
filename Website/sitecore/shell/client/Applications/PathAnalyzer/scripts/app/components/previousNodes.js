/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/models.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/scales.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function (require, exports, Models, EventManager, Scales, App) {

    var PreviousNodes = (function () {
        function PreviousNodes(el) {
            this.el = el;
            this.bus = new EventManager.Bus();
            this.getNodesFunc = Models.Path.getPreviousNodes;
            this.selector = ".previousNodes";
            this.cssClass = "node previousNode";
            this.setupSubscribers();
        }
        PreviousNodes.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("exitpath:mouseover", function (node, data) {
                var DimColor = App.Settings.instance().DimColor;
                var SelectedColor = App.Settings.instance().SelectedColor;

                d3.selectAll("circle.previousNode").attr("stroke", null).attr("style", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return "fill:" + SelectedColor;
                    }
                }).classed("selected", function (d) {
                    return this.parentNode.__data__.isExit;
                }).classed("dimmed", function (d) {
                    return !this.parentNode.__data__.isExit;
                });

                d3.selectAll("circle.nextNode").attr("style", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return "fill:" + DimColor;
                    }
                }).classed("dimmed", true);
            });

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
                self.reset();
            });

            this.bus.subscribe("node:mouseover", function (node, data) {
                var DimColor = App.Settings.instance().DimColor;
                var SelectedColor = App.Settings.instance().SelectedColor;

                d3.selectAll("circle.node").attr("stroke", null).attr("style", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return "fill:" + DimColor;
                    }
                }).classed("dimmed", true);

                d3.select(data.parent).selectAll("circle.previousNode").attr("style", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return "fill:" + SelectedColor;
                    }
                }).classed("dimmed", false).classed("selected", true);

                if (node.next) {
                    var id = "#node" + node.id;
                    d3.select(id).attr("style", function (d) {
                        if (App.AppState.instance().highLevelEntryEnabled() || App.AppState.instance().highLevelExitEnabled()) {
                            return "fill:" + SelectedColor;
                        }
                    }).classed("dimmed", false).classed("selected", true);
                } else {
                    d3.select(data.parent).selectAll("circle.nextNode").attr("style", function (d) {
                        if (App.AppState.instance().highLevelEntryEnabled() || App.AppState.instance().highLevelExitEnabled()) {
                            return "fill:" + SelectedColor;
                        }
                    }).classed("dimmed", false).classed("selected", true);
                }
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.reset();
            });
        };

        PreviousNodes.prototype.reset = function () {
            var self = this;

            d3.selectAll("circle.node").classed("dimmed", false).classed("selected", false).classed("current", function (d) {
                return d.current;
            }).attr("style", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return "fill:" + App.Settings.instance().NoDetailsColor;
                }
                if (d.next && App.AppState.instance().highLevelExitEnabled()) {
                    return "fill:" + Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
                }
            }).attr("stroke", function (d, i) {
                if (!d.current && App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                if (!d.current) {
                    return Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
                }
                return null;
            });
        };

        PreviousNodes.prototype.render = function () {
            var self = this;

            var nodes = self.el.selectAll(this.selector).data(function (d) {
                return self.getNodesFunc(d).reverse();
            });

            nodes.enter().append("circle").attr("id", function (d) {
                return "node" + d.id;
            }).attr("cx", function (d, i) {
                return self.nodeXScale(i);
            }).attr("cy", function (d, i, j) {
                return self.nodeYScale(j);
            }).attr("r", function (d) {
                return d.getRadius();
            }).attr("style", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return "fill:" + App.Settings.instance().NoDetailsColor;
                }
                if (d.next && App.AppState.instance().highLevelExitEnabled()) {
                    return "fill:" + Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
                }
            }).attr("stroke", function (d, i) {
                if (!d.current && App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                if (!d.current) {
                    return Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
                }
            }).attr("stroke-width", function (d) {
                return d.getStrokeWidth();
            }).attr("class", self.cssClass).classed("current", function (d) {
                return d.current;
            }).on("click", function (d) {
                if (self.bus) {
                    self.bus.publish("path:selected", d, { el: this, path: this.parentNode.__data__ });
                }
            }).on("mouseover", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseover", d, { el: this, path: this.parentNode.__data__, isNode: true, parent: this.parentNode });
                }
            }).on("mouseout", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseout", d, { el: this, path: this.parentNode.__data__, self: this });
                }
            });
        };
        return PreviousNodes;
    })();
    return PreviousNodes;
});