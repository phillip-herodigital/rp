/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/models.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/scales.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function (require, exports, Models, EventManager, Scales, App) {
    

    var NextNodeLabels = (function () {
        function NextNodeLabels(el, nodes) {
            this.el = el;
            this.nodes = nodes;
            this.bus = new EventManager.Bus();
            this.getNodesFunc = Models.Path.getPreviousNodes;
            this.nodeRadiusScale = Scales.getInstance().nodeRadiusScale;
            this.fixedYPosition = 0;
            this.selector = "exitNodeName";
            this.fixedXPosition = App.Settings.instance().width - App.Settings.instance().midPadding;
            this.nodeYScale = d3.scale.linear().domain([0, nodes.length]).range([App.Settings.instance().topPadding, App.Settings.instance().height]);

            this.setupSubscribers();
        }
        NextNodeLabels.prototype.render = function () {
            var self = this;

            self.el.selectAll("." + this.selector).data(function (d) {
                return d.next;
            }).enter().append("text").text(function (d) {
                if (d.name.length > 25)
                    return d.name.substring(0, 25) + "...";
                return d.name;
            }).attr({
                x: self.fixedXPosition + 15,
                y: function (d) {
                    var padding = 15;
                    if (!App.AppState.instance().highLevelExitEnabled())
                        padding += 10;
                    return self.nodeYScale(self.nodes.indexOf(d)) + padding;
                },
                class: this.selector,
                id: function (d) {
                    return "nodeName" + d.id;
                }
            }).style("opacity", 0);
        };

        NextNodeLabels.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
                self.off();
            });

            this.bus.subscribe("node:mouseover", function (node, data) {
                var nodeLabelContainerSelection;
                if (node.next) {
                    nodeLabelContainerSelection = d3.select("#nodeName" + node.id);
                } else {
                    nodeLabelContainerSelection = d3.select(data.parent).selectAll("." + self.selector);
                }

                self.on(nodeLabelContainerSelection);
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.off();
            });

            this.bus.subscribe("reset", function () {
                self.off();
            });
        };

        NextNodeLabels.prototype.off = function () {
            d3.selectAll("." + this.selector).style("opacity", 0);
        };

        NextNodeLabels.prototype.on = function (labelEl) {
            labelEl.transition().style("opacity", 1);
        };
        return NextNodeLabels;
    })();
    return NextNodeLabels;
});