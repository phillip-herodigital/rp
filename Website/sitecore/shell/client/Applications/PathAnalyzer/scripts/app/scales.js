/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/application.js", "/-/speak/v1/pathanalyzer/scripts/app/models.js"], function (require, exports, App, Models) {
    "use strict";

    var Scales = (function () {
        function Scales(w, h) {
            this.w = w;
            this.h = h;
            if (Scales._instance === null) {
                this.init(w, h);
            }

            return Scales._instance;
        }
        Scales.prototype.init = function (w, h) {
            Scales._instance = this;
            this.w = w;
            this.h = h;
            this.SelectedColor = App.Settings.instance().SelectedColor;
            this.topPadding = App.Settings.instance().topPadding;
        };

        Scales.prototype.load = function (data) {
            var paths = Models.Filter.getInstance().process(data.paths);

            var efficiencySet = data.paths.map(function (p) {
                return d3.round(p.efficiency, 0);
            }).filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            });

            this.minEfficiency = d3.min(efficiencySet, function (e) {
                return e;
            });
            this.maxEfficiency = d3.max(efficiencySet, function (e) {
                return e;
            });
            this.avgEfficiency = d3.mean(efficiencySet, function (e) {
                return e;
            });

            var colorRange = App.Settings.instance().colorRange;
            this.scale = d3.scale.ordinal().range(colorRange).domain([0 /* Poor */, 1 /* Fair */, 3 /* Good */, 4 /* Great */]);

            var minVisits = d3.min(paths, function (p) {
                return p.visits;
            });
            var maxVisits = d3.max(paths, function (p) {
                return p.visits;
            });

            this.strokeScale = d3.scale.linear().domain([minVisits, maxVisits]).range([5, 20]);

            var previousNodes = d3.merge(paths.map(function (p) {
                if (p.previous)
                    return p.previous;
            }));
            var nextNodes = d3.merge(paths.map(function (p) {
                if (p.next)
                    return p.next;
            }));

            var allNodes = previousNodes.concat(nextNodes);

            var minValue = d3.min(allNodes, function (p) {
                return p.value;
            });
            var maxValue = d3.max(allNodes, function (p) {
                return p.value;
            });
            this.nodeRadiusScale = d3.scale.linear().domain([minValue, maxValue]).range([8, 16]);

            var minNextValue = d3.min(nextNodes, function (p) {
                return p.value;
            });
            var maxNextValue = d3.max(nextNodes, function (p) {
                return p.value;
            });
            this.nextNodeRadiusScale = d3.scale.linear().domain([minNextValue, maxNextValue]).range([5, 15]);

            // TODO: make scale dynamic
            this.exitMarkerScale = d3.scale.linear().domain([0, maxVisits]).range([500, 500]);
        };

        Scales.prototype.getEffiencyColor = function (efficiency) {
            var efficiencyGrade;
            if (efficiency < 1) {
                efficiencyGrade = 0 /* Poor */;
            } else if (efficiency < this.avgEfficiency) {
                efficiencyGrade = 1 /* Fair */;
            } else if (efficiency > this.avgEfficiency && efficiency < this.maxEfficiency) {
                efficiencyGrade = 3 /* Good */;
            } else if (efficiency >= this.maxEfficiency) {
                efficiencyGrade = 4 /* Great */;
            }

            return this.scale(efficiencyGrade);
        };

        Scales.getInstance = function () {
            return Scales._instance;
        };
        Scales._instance = null;
        return Scales;
    })();
    return Scales;
});
