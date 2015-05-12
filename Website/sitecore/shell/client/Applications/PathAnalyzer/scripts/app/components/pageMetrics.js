/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/models.js"], function (require, exports, EventManager, Models) {
    "use strict";

    var PageMetrics = (function () {
        function PageMetrics(el) {
            this.el = el;
            this.init();
        }
        PageMetrics.prototype.render = function () {
        };

        PageMetrics.prototype.init = function () {
            this.bus = new EventManager.Bus();
            var self = this;

            this.bus.subscribe("node:mouseover", function (node, data) {
                var metrics = Models.MetricHelper.create(data.path.visits, data.path.value);
               
                self.el.selectAll(".currentMetric").transition().duration(0).delay(300).tween("text", function (d) {
                    var match = $.grep(metrics, function (e) {
                        return e.id == d.id;
                    });
                    var newValue;
                    if (match.length > 0 && match[0]) {
                        newValue = match[0].displayValue.replace(/,/g, "");
                    }
                    var prevValue = this.textContent.replace(/,/g, "");
                    var interpolator = d3.interpolateRound(+prevValue, +newValue);

                    var format = d3.format("0,000");
                    return function (t) {
                        this.textContent = format(interpolator(t));
                    };
                });
            });

            this.bus.subscribe("node:mouseout", function (node) {
              self.el.selectAll(".currentMetric").transition().duration(0).delay(300).tween("text", function (d) {
                    var newValue = d.displayValue.replace(/,/g, "");
                    var prevValue = this.textContent.replace(/,/g, "");
                    var interpolator = d3.interpolateRound(+prevValue, +newValue);

                    var format = d3.format("0,000");
                    return function (t) {
                        this.textContent = format(interpolator(t));
                    };
                });
            });

            this.bus.subscribe("data:loaded", function (data) {
                var metrics = Models.MetricHelper.create(data.visits, data.value);

                var metricsSelection = self.el.selectAll("div").data(metrics).enter();

                var metricSelection = metricsSelection.append("div").attr("id", function (d, i) {
                    return d.id;
                });

                metricSelection.append("span").text(function (d, i) {
                    return d.displayLabel;
                });

                metricSelection.append("h3").text(function (d, i) {
                    return d.displayValue;
                }).classed("currentMetric", true);
            });
        };
        return PageMetrics;
    })();
    exports.PageMetrics = PageMetrics;
});
