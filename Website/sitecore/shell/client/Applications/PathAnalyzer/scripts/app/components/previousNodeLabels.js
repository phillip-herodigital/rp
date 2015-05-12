/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/models.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js"], function (require, exports, Models, EventManager) {
    

    var PreviousNodeLabels = (function () {
        function PreviousNodeLabels(el) {
            this.el = el;
            this.bus = new EventManager.Bus();
            this.getNodesFunc = Models.Path.getPreviousNodes;
            this.setupSubscribers();
        }
        PreviousNodeLabels.prototype.setupSubscribers = function () {
            var self = this;

            this.bus.subscribe("exitpath:mouseout", function (node, data) {
                self.off();
            });

            this.bus.subscribe("node:mouseover", function (node, data) {
                self.on(data.parent);
            });

            this.bus.subscribe("node:mouseout", function (node, data) {
                self.off();
            });
        };

        PreviousNodeLabels.prototype.off = function () {
            d3.selectAll(".entryNodeName").transition().style("opacity", 0);
        };

        PreviousNodeLabels.prototype.on = function (el) {
            d3.select(el).selectAll(".entryNodeName").transition().style("opacity", 1);
        };

        PreviousNodeLabels.prototype.render = function () {
            var self = this;

            var entryNodeNames = self.el.selectAll("text.entryNodeName").data(function (d) {
                return self.getNodesFunc(d).reverse();
            }).enter().append("text").text(function (d) {
                if (d.name.length > 25)
                    return d.name.substring(0, 25) + "...";
                return d.name;
            }).attr({
                transform: function (d, i, j) {
                    var r = d.getRadius();
                    var x = self.nodeXScale(i) + 10;
                    var y = self.nodeYScale(j) - 17 - r / 3;

                    return "translate(" + x + ", " + y + ") rotate(320)";
                },
                class: "entryNodeName",
                id: function (d) {
                    return "nodeName" + d.id;
                }
            }).style("opacity", 0);
        };
        return PreviousNodeLabels;
    })();
    return PreviousNodeLabels;
});