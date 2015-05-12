/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require",
    "exports",
    "/-/speak/v1/pathanalyzer/scripts/app/components/nextNodes.js",
    "/-/speak/v1/pathanalyzer/scripts/app/components/previousNodes.js",
    "/-/speak/v1/pathanalyzer/scripts/app/components/previousNodeLabels.js",
    "/-/speak/v1/pathanalyzer/scripts/app/components/nextNodeLabels.js",
    "/-/speak/v1/pathanalyzer/scripts/app/models.js",
    "/-/speak/v1/pathanalyzer/scripts/app/utils/helpers.js",
    "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js",
    "/-/speak/v1/pathanalyzer/scripts/app/scales.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js"],
    function (require, exports, NextNodes, PreviousNodes, PreviousNodeLabels, NextNodeLabels, Models, Helpers, EventManager, Scales, App) {
    var PathSequence = (function () {
        function PathSequence(el, w, h) {
            this.el = el;
            this.w = w;
            this.h = h;
            this.bus = new EventManager.Bus();
            this.topPadding = App.Settings.instance().topPadding;
            this.midPadding = App.Settings.instance().midPadding;
            this.leftPadding = App.Settings.instance().leftPadding;

            this.lineMaker = d3.svg.line().x(function (d) {
                return d.x;
            }).y(function (d) {
                return d.y;
            }).interpolate("linear");
            this.setupSubscribers();
        }
        PathSequence.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("path:selected", function (node, data) {
                var pathGroup = self.el.selectAll(".nonlanding");
                pathGroup.selectAll("path").classed("muted", true);
                pathGroup.selectAll("circle").classed("muted", true);

                var selectedPathId = "#group" + data.path.id;
                var selectedPathGroup = self.el.selectAll(selectedPathId);
                selectedPathGroup.selectAll("path").classed("muted", false);
                selectedPathGroup.selectAll("circle").classed("muted", false);
                selectedPathGroup.selectAll("path").classed("selected", true);
                selectedPathGroup.selectAll("circle").classed("selected", true);
            });

            this.bus.subscribe("exitpath:mouseover", function (node, data) {
                var DimColor = App.Settings.instance().DimColor;
                var SelectedColor = App.Settings.instance().SelectedColor;

                self.el.selectAll(".nonlanding").selectAll("path").attr("stroke", DimColor);

                self.el.selectAll(".prevPath").attr("stroke", function (d) {
                    if (d.isExit) {
                        return App.Settings.instance().SelectedColor;
                    }
                    return App.Settings.instance().DimColor;
                });
            });

            this.bus.subscribe("reset", function (filter) {
                self.render();
            });

            this.bus.subscribe("data:updated", function (newData) {
                self.update(newData.paths);
            });

            this.bus.subscribe("sort:changed", function (sort) {
                self.render();
            });

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
              self.el.selectAll(".nonlanding").selectAll("path").attr("stroke", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return App.Settings.instance().NoDetailsColor;
                    }
                    return Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
                });
            });

            this.bus.subscribe("node:mouseover", function (node, data) {
                var DimColor = App.Settings.instance().DimColor;
                var SelectedColor = App.Settings.instance().SelectedColor;

                self.el.selectAll(".nonlanding").selectAll("path").attr("stroke", DimColor);
                d3.select(data.parent).selectAll(".prevPath").attr("stroke", SelectedColor);

                if (!node.next)
                    d3.select(data.parent).selectAll(".nextPath").attr("stroke", SelectedColor);

                var exitPathId = "#exitpath" + node.id;
                d3.select(data.parent).select(exitPathId).attr("stroke", SelectedColor);
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                d3.selectAll(".nonlanding").selectAll("path").attr("stroke", function (d) {
                    if (App.AppState.instance().highLevelEntryEnabled()) {
                        return App.Settings.instance().NoDetailsColor;
                    }
                    return Scales.getInstance().getEffiencyColor(this.parentNode.__data__.efficiency);
                });
            });
        };

        PathSequence.prototype.render = function () {
            this.update(this.el[0][0].__data__.paths);
        };

        PathSequence.prototype.update = function (paths) {
            var length = this.w - this.leftPadding - this.midPadding;
            var exitPathlength = this.w / 2 + this.leftPadding + this.midPadding;

            var paths = Models.Filter.getInstance().process(paths);
            var nonLanding = paths.filter(function (p) {
                return !p.isLanding;
            });

            var pathGroup = this.el.selectAll(".nonlanding").data(nonLanding, function (p) {
                var id = p.previous.map(function (p) {
                    return p.id;
                }).join('-');
                return id;
            });

            // TODO: this is bad, temp. workaround
            pathGroup.selectAll("path").remove();
            pathGroup.selectAll("circle").remove();
            pathGroup.selectAll("text").remove();

            pathGroup.enter().append("g").attr("id", function (p) {
                return "group" + p.id;
            }).attr("class", "nonlanding");

            pathGroup.exit().remove();

            var entryNodeCount = d3.max(nonLanding.map(function (a) {
                return a.previous.length;
            }));
            var pathCount = nonLanding.length;
            this.renderEntryPaths(pathGroup, nonLanding.length, entryNodeCount);
            this.renderPreviousNodes(pathGroup, pathCount, entryNodeCount);
            this.renderPreviousNodeLabels(pathGroup, pathCount, entryNodeCount);

            var nextNodes = d3.merge(paths.map(function (p) {
                if (App.AppState.instance().highLevelEntryEnabled())
                    return p.next.slice(0, 2);
                return p.next;
            }));
            this.renderNextPaths(pathGroup, nextNodes);
            new NextNodes(pathGroup, nextNodes).render();
            new NextNodeLabels(pathGroup, nextNodes).render();
        };

        PathSequence.prototype.renderEntryPaths = function (pathGroup, pathCount, entryNodeCount) {
            var self = this;
            var strokeScale = Scales.getInstance().strokeScale;
            var pathGenerator = Helpers.EntryPathGenerator.getInstance();

            var domain = [];
            for (var i = entryNodeCount - 1; i >= 0; i--) {
                domain.push(i);
            }
            var nodeXScale = d3.scale.ordinal().domain(domain).rangePoints([0, this.w / 2 - this.midPadding * 1.5], 0.01);

            pathGroup.append("path").attr("class", "prevPath").attr("d", function (d, i) {
                var start = nodeXScale(d.previous.length - 2);
                return self.lineMaker(pathGenerator.generate(i, pathCount, start));
            }).attr("stroke", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return App.Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.efficiency);
            }).attr("stroke-width", function (d) {
                if (App.AppState.instance().highLevelEntryEnabled()) {
                    return 2;
                }
                return strokeScale(d.visits);
            }).attr("fill", "none").on("click", function (d) {
                if (self.bus) {
                    self.bus.publish("path:selected", d.previous[d.previous.length - 1], { el: this, path: this.parentNode.__data__ });
                }
            }).on("mouseover", function (d, i) {
                if (self.bus) {
                    self.bus.publish("node:mouseover", d.previous[d.previous.length - 1], { el: this, path: this.parentNode.__data__, parent: this.parentNode });
                }
            }).on("mouseout", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseout", d.previous[d.previous.length - 1], { el: this, path: this.parentNode.__data__ });
                }
            });
        };

        PathSequence.prototype.renderPreviousNodeLabels = function (pathGroup, pathLength, maxEntryNodeCount) {
            var domain = [];
            for (var i = maxEntryNodeCount - 1; i >= 0; i--) {
                domain.push(i);
            }

            var labels = new PreviousNodeLabels(pathGroup);
            labels.nodeXScale = d3.scale.ordinal().domain(domain).rangePoints([0, this.w / 2 - this.midPadding * 1.5], 0.1);
            labels.nodeYScale = d3.scale.linear().domain([0, pathLength]).range([this.topPadding, this.h]);
            labels.render();
        };

        PathSequence.prototype.renderPreviousNodes = function (pathGroup, pathLength, maxEntryNodeCount) {
            var domain = [];
            for (var i = maxEntryNodeCount - 1; i >= 0; i--) {
                domain.push(i);
            }

            var prevNodes = new PreviousNodes(pathGroup);
            prevNodes.nodeXScale = d3.scale.ordinal().domain(domain).rangePoints([0, this.w / 2 - this.midPadding * 1.5], 0.1);
            prevNodes.nodeYScale = d3.scale.linear().domain([0, pathLength]).range([this.topPadding, this.h]);
            prevNodes.render();
        };

        PathSequence.prototype.renderNextPaths = function (pathGroup, nextNodes) {
            var self = this;
            var strokeScale = Scales.getInstance().strokeScale;
            var generator = Helpers.EntryPathGenerator.getInstance();

            var nextPaths = pathGroup.selectAll(".nextPath").data(function (d) {
                if (App.AppState.instance().highLevelEntryEnabled())
                    return d.next.slice(0, 2);
                return d.next;
            }, function (p) {
                return p.id;
            });

            nextPaths.enter().append("svg:path").attr("id", function (d) {
                return "exitpath" + d.id;
            }).attr("d", function (d, i) {
                var index = Helpers.ArrayHelper.findIndex(nextNodes, d.id);
                return self.lineMaker(generator.generateExit(index, nextNodes.length));
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
                    // TODO: temp workaround. checking if d is node
                    if (d.id) {
                        self.bus.publish("node:mouseover", d, { el: this, path: this.parentNode.__data__, parent: this.parentNode });
                    } else {
                        self.bus.publish("node:mouseover", d.next[i], { el: this, path: this.parentNode.__data__, parent: this.parentNode });
                    }
                }
            }).on("mouseout", function (d) {
                if (self.bus) {
                    self.bus.publish("node:mouseout", d, { el: this, path: this.parentNode.__data__ });
                }
            });
        };
        return PathSequence;
    })();
    exports.PathSequence = PathSequence;
});
