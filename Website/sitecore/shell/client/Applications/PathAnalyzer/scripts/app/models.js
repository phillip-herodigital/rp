define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/utils/helpers.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/resources.js", "/-/speak/v1/pathanalyzer/scripts/app/application.js", "/-/speak/v1/pathanalyzer/scripts/app/scales.js"], function (require, exports, Helpers, Resources, App, Scales) {
    var Filter = (function () {
        function Filter(sortBy, desc, take) {
            if (Filter._instance === null) {
                this.init(sortBy, desc, take);
            }
            return Filter._instance;
        }
        Filter.prototype.init = function (sortBy, desc, take) {
            Filter._instance = this;
            this.sortBy = sortBy;
            this.desc = desc;
            this.take = take;
        };

        Filter.prototype.process = function (paths) {
            var self = this;

            if (this.sortBy) {
                var sortBy = this.sortBy;
                paths.sort(function (a, b) {
                    if (self.desc)
                        return d3.descending(a[sortBy], b[sortBy]);
                    return d3.ascending(a[sortBy], b[sortBy]);
                });
            }

            if (this.take > 0) {
                return paths.slice(0, this.take);
            }

            return paths;
        };

        Filter.getInstance = function () {
            return Filter._instance;
        };

        Filter.showingAll = function () {
            return Filter._instance.take < 0;
        };
        Filter._instance = null;
        return Filter;
    })();
    exports.Filter = Filter;

    var Node = (function () {
        function Node(id, name, url, visits, value, current, next) {
            if (typeof next === "undefined") { next = false; }
            this.id = id;
            this.name = name;
            this.url = url;
            this.visits = visits;
            this.value = value;
            this.current = current;
            this.next = next;
        }
        Node.create = function (metrics, data) {
            var id = metrics.id;
            var name = data.name;
            var url = data.url;
            var visits = metrics.visits;
            var value = metrics.value;
            var current = metrics.current;

            return new Node(id, name, url, visits, value, current);
        };

        Object.defineProperty(Node.prototype, "efficiency", {
            get: function () {
                return this.value / this.visits;
            },
            enumerable: true,
            configurable: true
        });

        Node.prototype.getRadius = function () {
            if ((!this.next && App.AppState.instance().highLevelEntryEnabled()) || (this.next && App.AppState.instance().highLevelExitEnabled())) {
                return 4;
            }
            if (this.current) {
                return 13;
            } else {
                return Scales.getInstance().nodeRadiusScale(this.value);
            }
        };

        Node.prototype.getStrokeWidth = function () {
            if (App.AppState.instance().highLevelEntryEnabled() || (this.next && App.AppState.instance().highLevelExitEnabled())) {
                return 1;
            }
            if (!this.current) {
                return Scales.getInstance().nodeRadiusScale(this.value) / 3;
            }
        };
        return Node;
    })();
    exports.Node = Node;

    var Metric = (function () {
        function Metric(id, displayLabel, displayValue) {
            this.id = id;
            this.displayLabel = displayLabel;
            this.displayValue = displayValue;
        }
        return Metric;
    })();
    exports.Metric = Metric;

    var MetricHelper = (function () {
        function MetricHelper() {
        }
        MetricHelper.create = function (visits, value) {
            var format = d3.format("0,000");
            var efficiencyFormat = d3.format(".2f");
            var metrics = new Array();

            metrics.push(new Metric("visitsMetric", Resources.Strings.get("Visits"), format(visits)));
            metrics.push(new Metric("valueMetric", Resources.Strings.get("Value"), format(value)));
            metrics.push(new Metric("efficiencyMetric", Resources.Strings.get("Value Per Visit"), efficiencyFormat(value / visits)));
            return metrics;
        };
        return MetricHelper;
    })();
    exports.MetricHelper = MetricHelper;

    var PathData = (function () {
        function PathData(root, contextid, contextname, paths, value, visits, efficiency, exitcount, exitvalue, exitefficiency, exitpotential, landing, maxinteractions) {
            this.root = root;
            this.contextid = contextid;
            this.contextname = contextname;
            this.paths = paths;
            this.value = value;
            this.visits = visits;
            this.efficiency = efficiency;
            this.exitcount = exitcount;
            this.exitvalue = exitvalue;
            this.exitefficiency = exitefficiency;
            this.exitpotential = exitpotential;
            this.landing = landing;
            this.maxinteractions = maxinteractions;
            var exitingPaths = paths.filter(function (d) {
                return d.isExit;
            });
            this.averageExitingPathEfficiency = d3.mean(exitingPaths, function (d) {
                return d.efficiency;
            });
            this.totalExitingPathVisits = d3.sum(exitingPaths, function (d) {
                return d.visits;
            });
        }
        PathData.create = function (source) {
            if (!source) {
                return;
            }
            var paths = new Array();

            var root = new Node(source.root.id, "root", "", source.root.visits, source.root.value, source.root.current);

            var filteredPaths = Filter.getInstance().process(source.paths);

            filteredPaths.forEach(function (p) {
                var pathId = PathData.createPathId(p);

                var previousNodes = PathData.hydrateNodes(pathId, p.previous, source.nodes);
                var nextNodes = PathData.hydrateNodes(pathId, p.next, source.nodes, true);

                var path = Path.create(pathId, p, previousNodes, nextNodes);
                paths.push(path);
            });

            return new PathData(root, source.contextid, source.contextname, paths, source.value, source.visits, source.efficiency, source.exitcount, source.exitvalue, source.exitefficiency, source.exitpotential, source.landing, source.maxinteractions);
        };

        PathData.hydrateNodes = function (pathId, source, dataNodes, next) {
            if (typeof next === "undefined") { next = false; }
            var nodes = new Array();

            source.forEach(function (n) {
                var id = n.id;
                var nodeData = Helpers.ArrayHelper.findNode(dataNodes, id);
                if (nodeData) {
                    nodes.push(new Node(pathId + '_' + id, nodeData.name, nodeData.url, n.visits, n.value, n.current, next));
                }
            });
            return nodes;
        };

        PathData.createPathId = function (path) {
            return path.previous.map(function (n) {
                return n.id;
            }).concat(path.next.map(function (n) {
                return n.id;
            })).join('_');
        };
        return PathData;
    })();
    exports.PathData = PathData;

    var Path = (function () {
        function Path(id, visits, value, exitcount, exitvalue, depth, efficiency, exitpotential, previous, next) {
            this.id = id;
            this.visits = visits;
            this.value = value;
            this.exitcount = exitcount;
            this.exitvalue = exitvalue;
            this.depth = depth;
            this.efficiency = efficiency;
            this.exitpotential = exitpotential;
            this.previous = previous;
            this.next = next;
            this._isLanding = this.previous.length == 1 && this.previous[0].current;
            this._isExit = this.exitcount > 0;
        }
        Path.create = function (id, source, previousNodes, nextNodes) {
            return new Path(id, source.visits, source.value, source.exitcount, source.exitvalue, source.depth, source.efficiency, source.exitpotential, previousNodes, nextNodes);
        };

        Object.defineProperty(Path.prototype, "isLanding", {
            get: function () {
                return this._isLanding;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Path.prototype, "isExit", {
            get: function () {
                return this._isExit;
            },
            enumerable: true,
            configurable: true
        });
        Path.getPreviousNodes = function (path) {
            if (path.previous.length > 0) {
                var copy = path.previous.slice();
                return copy.splice(0, copy.length - 1);
            }

            return path.previous;
        };

        Path.getNextNodes = function (path) {
            return path.next;
        };
        return Path;
    })();
    exports.Path = Path;

    (function (EfficiencyGrade) {
        EfficiencyGrade[EfficiencyGrade["Poor"] = 0] = "Poor"; //TODO: localization (do these need to be localized?)
        EfficiencyGrade[EfficiencyGrade["Fair"] = 1] = "Fair";
        EfficiencyGrade[EfficiencyGrade["OK"] = 2] = "OK";
        EfficiencyGrade[EfficiencyGrade["Good"] = 3] = "Good";
        EfficiencyGrade[EfficiencyGrade["Great"] = 4] = "Great";
    })(exports.EfficiencyGrade || (exports.EfficiencyGrade = {}));
    var EfficiencyGrade = exports.EfficiencyGrade;
});
