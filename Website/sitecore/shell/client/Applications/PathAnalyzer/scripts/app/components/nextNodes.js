/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/models.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/scales.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function (require, exports, Models, EventManager, Scales, App) {
    

    var NextNodes = (function () {
        function NextNodes(el, nodes) {
            this.el = el;
            this.nodes = nodes;
            this.bus = new EventManager.Bus();
            this.renderingPrevious = false;
            this.getNodesFunc = Models.Path.getNextNodes;
            this.selector = ".nextNodes";
            this.cssClass = "node nextNode";
            this.nodeRadiusScale = Scales.getInstance().nodeRadiusScale;
            this.fixedYPosition = 0;
            this.fixedXPosition = App.Settings.instance().width - App.Settings.instance().midPadding;
            this.nodeYScale = d3.scale.linear().domain([0, nodes.length]).range([App.Settings.instance().topPadding, App.Settings.instance().height]);

            this.setupSubscribers();
        }
        NextNodes.prototype.setupSubscribers = function () {
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
                    d3.select("#node" + node.id).attr("style", function (d) {
                        if (App.AppState.instance().highLevelEntryEnabled() || App.AppState.instance().highLevelExitEnabled()) {
                            return "fill:" + SelectedColor;
                        }
                    }).classed("dimmed", false).classed("selected", true);
                } else {
                    var pathGroup = d3.select(data.parent);
                    pathGroup.selectAll("circle.nextNode").attr("style", function (d) {
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

        NextNodes.prototype.reset = function () {
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

        NextNodes.prototype.render = function () {
            var self = this;

            var radiusScale = this.nodeRadiusScale;

            var nodes = self.el.selectAll(this.selector).data(function (d) {
                if (App.AppState.instance().highLevelEntryEnabled())
                    return self.getNodesFunc(d).slice(0, 2);
                return self.getNodesFunc(d);
            });

            nodes.enter().append("circle").attr("id", function (d) {
                return "node" + d.id;
            }).attr("cx", self.fixedXPosition).attr("cy", function (d) {
                return self.nodeYScale(self.nodes.indexOf(d));
            }).attr("r", function (d) {
                if ((!d.next && App.AppState.instance().highLevelEntryEnabled()) || (d.next && App.AppState.instance().highLevelExitEnabled())) {
                    return 4;
                }
                if (d.current) {
                    return 13;
                } else {
                    return radiusScale(d.value);
                }
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
            }).attr("stroke-width", function (d, i) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return 1;
                }
                if (d.next && App.AppState.instance().highLevelExitEnabled()) {
                    return 1;
                }
                if (!d.current) {
                    return radiusScale(d.value) / 3;
                }
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
        return NextNodes;
    })();
    return NextNodes;
});
