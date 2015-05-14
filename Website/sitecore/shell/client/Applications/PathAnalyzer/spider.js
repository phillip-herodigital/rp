var Settings = (function () {
    function Settings() {
        this.colorRange = ["#da3b1f", "#ec9d8d", "#90b67d", "#698e57"];
        this.NoDetailsColor = "#969696";
        this.DimColor = "#F7F7F7";
        this.SelectedColor = "#3FAED9";
        this.NumberFormat = d3.format("0,000");
        this.maxEntryPathWidth = 250;
        this.minEntryPathWidth = 15;
        this.minLineHeight = 3;
        this.maxLineHeight = 15;
        this.midPadding = 150;
        this.leftPadding = 10;
        this.topPadding = 50;
        this.hoverTimeout = 750;
    }
    Settings.init = function (height, width) {
        if (Settings._instance === null) {
            Settings._instance = new Settings();
            Settings._instance.width = width;
            Settings._instance.height = height;
            Settings._instance.domainEndRange = width / 2 - Settings._instance.midPadding * 1.5;
        }
    };
    Settings.instance = function () {
        return Settings._instance;
    };
    Settings._instance = null;
    return Settings;
})();
var Subscription = (function () {
    function Subscription(id, message_id, alwaysFire, callback) {
        this.id = id;
        this.message_id = message_id;
        this.alwaysFire = alwaysFire;
        this.callback = callback;
    }
    Subscription.prototype.unSubscribe = function () {
        new Bus().unSubscribe(this);
    };
    return Subscription;
})();
var Message = (function () {
    function Message(message) {
        this.message = message;
        this._id = message;
        this._subscriptions = [];
        this._nextId = 0;
    }
    Message.prototype.subscribe = function (callback, alwaysFire) {
        if (alwaysFire === void 0) { alwaysFire = false; }
        var subscription = new Subscription(this._nextId++, this._id, alwaysFire, callback);
        this._subscriptions[subscription.id] = subscription;
        return this._subscriptions[subscription.id];
    };
    Message.prototype.unSubscribe = function (subRef) {
        var idx = 0, len = this._subscriptions.length;
        while (idx < len) {
            if (this._subscriptions[idx] === subRef) {
                this._subscriptions.splice(idx, 1);
                this._subscriptions[idx] = undefined;
                console.log(subRef);
                console.log('subscription terminated');
            }
            break;
            idx += 1;
        }
    };
    Message.prototype.notify = function (payload, data, mute) {
        this._subscriptions.forEach(function (sub) {
            if (sub.alwaysFire || !mute) {
                sub.callback(payload, data);
            }
        });
    };
    return Message;
})();
var Bus = (function () {
    function Bus() {
        this._messages = {};
    }
    Bus.instance = function () {
        return Bus._instance;
    };
    Bus.init = function () {
        if (Bus._instance === null) {
            Bus._instance = new Bus();
        }
        return Bus._instance;
    };
    Bus.prototype.subscribe = function (message, callback, alwaysFire) {
        if (alwaysFire === void 0) { alwaysFire = false; }
        var msg;
        msg = this._messages[message] || (this._messages[message] = new Message(message));
        return msg.subscribe(callback, alwaysFire);
    };
    Bus.prototype.unSubscribe = function (subRef) {
        if (!(subRef instanceof Subscription)) {
            console.log(subRef instanceof Subscription, subRef, 'Error :: invalid argument! :: unSubscribe must be type of Subscription');
            return false;
        }
        (this._messages[subRef.message_id]).unSubscribe(subRef);
    };
    Bus.prototype.publish = function (message, payload, data) {
        var mute = State.pathSelected;
        if (data && data.ignoreMute) {
            mute = false;
        }
        if (this._messages[message]) {
            (this._messages[message]).notify(payload, data, mute);
        }
    };
    Bus._instance = null;
    return Bus;
})();
var Scales = (function () {
    function Scales(w, h) {
        this.w = w;
        this.h = h;
        if (Scales._instance) {
            throw new Error("Error: Instantiation failed: Use Scales.getInstance() instead of new.");
        }
        this.w = w;
        this.h = h;
        this.SelectedColor = Settings.instance().SelectedColor;
        this.topPadding = Settings.instance().topPadding;
        Scales._instance = this;
    }
    Scales.init = function (w, h) {
        Scales._instance = new Scales(w, h);
    };
    Scales.prototype.load = function (data) {
        var paths = Filter.getInstance().process(data.paths);
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
        var colorRange = Settings.instance().colorRange;
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
        this.exitMarkerScale = d3.scale.linear().domain([0, maxVisits]).range([500, 500]);
    };
    Scales.prototype.getEffiencyColor = function (efficiency) {
        var efficiencyGrade;
        if (efficiency < 1) {
            efficiencyGrade = 0 /* Poor */;
        }
        else if (efficiency < this.avgEfficiency) {
            efficiencyGrade = 1 /* Fair */;
        }
        else if (efficiency > this.avgEfficiency && efficiency < this.maxEfficiency) {
            efficiencyGrade = 3 /* Good */;
        }
        else if (efficiency >= this.maxEfficiency) {
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
var Filter = (function () {
    function Filter(sortBy, desc, take) {
        if (Filter.instance === null) {
            this.init(sortBy, desc, take);
        }
        return Filter.instance;
    }
    Filter.prototype.init = function (sortBy, desc, take) {
        Filter.instance = this;
        this.sortBy = sortBy;
        this.desc = desc;
        this.take = take;
    };
    Filter.prototype.process = function (paths) {
        var _this = this;
        if (this.sortBy) {
            var sortBy = this.sortBy;
            paths.sort(function (a, b) {
                if (_this.desc)
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
        return Filter.instance;
    };
    Filter.showingAll = function () {
        return Filter.instance.take < 0;
    };
    Filter.instance = null;
    return Filter;
})();
var DisplayNode = (function () {
    function DisplayNode(id, name, url, visits, value, pathEfficiency, current, next) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.visits = visits;
        this.value = value;
        this.pathEfficiency = pathEfficiency;
        this.current = current;
        this.next = next;
    }
    Object.defineProperty(DisplayNode.prototype, "efficiency", {
        get: function () {
            if (this.next)
                return this.value / this.visits;
            return this.pathEfficiency;
        },
        enumerable: true,
        configurable: true
    });
    DisplayNode.prototype.radius = function () {
        if ((!this.next && State.instance().highLevelEntryEnabled()) || (this.next && State.instance().highLevelExitEnabled())) {
            return 4;
        }
        if (this.current) {
            return 13;
        }
        else {
            return Scales.getInstance().nodeRadiusScale(this.value);
        }
    };
    DisplayNode.prototype.strokeWidth = function () {
        if (State.instance().highLevelEntryEnabled() || (this.next && State.instance().highLevelExitEnabled())) {
            return 1;
        }
        if (!this.current) {
            return Scales.getInstance().nodeRadiusScale(this.value) / 3;
        }
        return -1;
    };
    DisplayNode.prototype.style = function () {
        if (State.instance().highLevelEntryEnabled())
            return "fill:" + Settings.instance().NoDetailsColor;
        if (this.next && State.instance().highLevelExitEnabled())
            return "fill:" + Scales.getInstance().getEffiencyColor(this.efficiency);
        return null;
    };
    DisplayNode.prototype.stroke = function () {
        if (!this.current && State.instance().highLevelEntryEnabled())
            return Settings.instance().NoDetailsColor;
        return Scales.getInstance().getEffiencyColor(this.efficiency);
    };
    return DisplayNode;
})();
var Metric = (function () {
    function Metric(id, displayLabel, displayValue) {
        this.id = id;
        this.displayLabel = displayLabel;
        this.displayValue = displayValue;
    }
    return Metric;
})();
var MetricHelper = (function () {
    function MetricHelper() {
    }
    MetricHelper.create = function (visits, value) {
        var format = d3.format("0,000");
        var efficiencyFormat = d3.format(".2f");
        var metrics = new Array();
        metrics.push(new Metric("visitsMetric", Dictionary.getInstance().get("Visits"), format(visits)));
        metrics.push(new Metric("valueMetric", Dictionary.getInstance().get("Value"), format(value)));
        metrics.push(new Metric("efficiencyMetric", Dictionary.getInstance().get("Value/Visit"), efficiencyFormat(value / visits)));
        return metrics;
    };
    return MetricHelper;
})();
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
        var exitingPaths = paths.filter(function (d) { return d.isExit; });
        this.averageExitingPathEfficiency = d3.mean(exitingPaths, function (d) { return d.efficiency; });
        this.totalExitingPathVisits = d3.sum(exitingPaths, function (d) { return d.visits; });
    }
    PathData.create = function (source) {
        if (!source) {
            return null;
        }
        var paths = new Array();
        var root = new DisplayNode(source.root.id, "root", "", source.root.visits, source.root.value, -1, source.root.current, false);
        var filteredPaths = Filter.getInstance().process(source.paths);
        filteredPaths.forEach(function (p) {
            var pathId = PathData.createPathId(p);
            var previousNodes = PathData.hydrateNodes(pathId, p.efficiency, p.previous, source.nodes);
            var nextNodes = PathData.hydrateNodes(pathId, p.efficiency, p.next, source.nodes, true);
            var path = Path.create(pathId, p, previousNodes, nextNodes);
            paths.push(path);
        });
        return new PathData(root, source.contextid, source.contextname, paths, source.value, source.visits, source.efficiency, source.exitcount, source.exitvalue, source.exitefficiency, source.exitpotential, source.landing, source.maxinteractions);
    };
    PathData.hydrateNodes = function (pathId, pathEfficiency, source, dataNodes, next) {
        if (next === void 0) { next = false; }
        var nodes = new Array();
        source.forEach(function (n) {
            var id = n.id;
            var nodeData = ArrayHelper.findNode(dataNodes, id);
            if (nodeData) {
                nodes.push(new DisplayNode(pathId + '_' + id, nodeData.name, nodeData.url, n.visits, n.value, pathEfficiency, n.current, next));
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
        this._isLanding = this.previous.length === 1 && this.previous[0].current;
        this._isExit = this.exitcount > 0;
    }
    Path.create = function (id, source, previousNodes, nextNodes) {
        return new Path(id, source.visits, source.value, source.exitcount, source.exitvalue, source.depth, source.efficiency, source.exitpotential, previousNodes, nextNodes);
    };
    Path.getPreviousNodes = function (path) {
        if (path.previous.length > 0) {
            var copy = path.previous.slice();
            return copy.splice(0, copy.length - 1);
        }
        return path.previous;
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
    Path.getNextNodes = function (path) { return path.next; };
    return Path;
})();
var EfficiencyGrade;
(function (EfficiencyGrade) {
    EfficiencyGrade[EfficiencyGrade["Poor"] = 0] = "Poor";
    EfficiencyGrade[EfficiencyGrade["Fair"] = 1] = "Fair";
    EfficiencyGrade[EfficiencyGrade["OK"] = 2] = "OK";
    EfficiencyGrade[EfficiencyGrade["Good"] = 3] = "Good";
    EfficiencyGrade[EfficiencyGrade["Great"] = 4] = "Great";
})(EfficiencyGrade || (EfficiencyGrade = {}));
var State = (function () {
    function State() {
    }
    State.init = function () {
        if (State._instance === null) {
            State._instance = new State();
            State._instance.setupSubscribers();
        }
    };
    State.prototype.setupSubscribers = function () {
        var _this = this;
        Bus.instance().subscribe("data:loaded", function (data) {
            _this.updateCounts(data);
        });
        Bus.instance().subscribe("data:updated", function (data) {
            _this.updateCounts(data);
        });
        Bus.instance().subscribe("click", function () {
            State.pathSelected = true;
        });
    };
    State.prototype.updateCounts = function (data) {
        var nextNodes = d3.merge(data.paths.map(function (p) {
            if (p.next)
                return p.next;
        }));
        this.nextNodeCount = nextNodes.length;
        this.prevPathCount = data.paths.length;
    };
    State.instance = function () {
        return State._instance;
    };
    State.prototype.highLevelEntryEnabled = function () {
        if (this.prevPathCount < 15) {
            return false;
        }
        return Filter.showingAll();
    };
    State.prototype.highLevelExitEnabled = function () {
        if (this.nextNodeCount > 15) {
            return true;
        }
        return this.highLevelEntryEnabled();
    };
    State._instance = null;
    return State;
})();
var Dictionary = (function () {
    function Dictionary(sourceDictionary) {
        if (Dictionary._instance) {
            throw new Error("Error: Instantiation failed: Use Dictionary.getInstance() instead of new.");
        }
        this.dictionary = sourceDictionary;
        Dictionary._instance = this;
    }
    Dictionary.getInstance = function () {
        return Dictionary._instance;
    };
    Dictionary.init = function (sourceDictionary) {
        Dictionary._instance = new Dictionary(sourceDictionary);
    };
    Dictionary.prototype.get = function (key) {
        return this.dictionary.get(key) || key;
    };
    Dictionary._instance = null;
    return Dictionary;
})();
var ExitMarker = (function () {
    function ExitMarker(parent) {
        this.parent = parent;
    }
    ExitMarker.prototype.render = function () {
        var x = d3.scale.linear().range([Settings.instance().width / 2, Settings.instance().width / 2]).domain([0, 1]);
        var y = d3.scale.linear().range([350, 350]).domain([0, 1]);
        var d = d3.svg.symbol().type('triangle-down').size(1000);
        this.parent.append("path").attr("class", "arrow").attr("d", d).attr("width", 300).attr("transform", function () { return ("translate(" + x(1) + "," + y(1) + ")"); }).attr("fill", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            return Scales.getInstance().getEffiencyColor(d.averageExitingPathEfficiency);
        });
    };
    return ExitMarker;
})();
var ExitLabels = (function () {
    function ExitLabels(parent) {
        this.parent = parent;
    }
    ExitLabels.prototype.render = function () {
        this.parent.append("text").attr("x", Settings.instance().width / 2).attr("y", (Settings.instance().height / 2) + 150).text(Dictionary.getInstance().get("Exits")).attr("class", "metricsLabel metrics");
        this.parent.append("text").attr("x", Settings.instance().width / 2).attr("y", Settings.instance().height / 2 + 175).text(function () {
            return Settings.instance().NumberFormat(this.parentNode.parentNode.parentNode.__data__.exitcount);
        }).attr("class", "metricsValue metrics").attr("id", "exitCount");
        this.parent.append("text").attr("x", function () {
            return Settings.instance().width / 2;
        }).attr("y", function () {
            return (Settings.instance().height / 2) + 200;
        }).text(Dictionary.getInstance().get("Exit Potential")).attr("class", "metricsLabel metrics");
        this.parent.append("text").attr("x", function () {
            return Settings.instance().width / 2;
        }).attr("y", function () {
            return (Settings.instance().height / 2) + 225;
        }).text(function (d) {
            return d3.round(this.parentNode.parentNode.parentNode.__data__.exitpotential, 3);
        }).attr("class", "metricsValue metrics").attr("id", "exitPotential");
    };
    return ExitLabels;
})();
var ExitGroup = (function () {
    function ExitGroup(parent) {
        this.parent = parent;
    }
    ExitGroup.prototype.render = function () {
        var _this = this;
        this.el = this.parent.append('g').attr("class", "metricsLabelGroup").on("mouseover", function (d) {
            _this.hoverTimeoutId = setTimeout(function () {
                Bus.instance().publish("exit:mouseover", d);
            }, Settings.instance().hoverTimeout);
        }).on("mouseout", function (d) {
            window.clearTimeout(_this.hoverTimeoutId);
            Bus.instance().publish("reset", d);
        });
        return this.el;
    };
    return ExitGroup;
})();
var LandingMarker = (function () {
    function LandingMarker(parent, color) {
        this.parent = parent;
        this.color = color;
    }
    LandingMarker.prototype.render = function () {
        var self = this;
        var x = d3.scale.linear().range([Settings.instance().width / 2, Settings.instance().width / 2]).domain([0, 1]);
        var y = d3.scale.linear().range([145, 145]).domain([0, 1]);
        var d = d3.svg.symbol().type('triangle-down').size(500);
        this.parent.append("path").attr("class", "arrow").attr("d", d).attr("transform", function () { return ("translate(" + x(1) + "," + y(1) + ")"); }).attr("fill", function () {
            if (State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            return self.color;
        });
    };
    return LandingMarker;
})();
var LandingLabels = (function () {
    function LandingLabels(parent, hasLandings) {
        this.parent = parent;
        this.hasLandings = hasLandings;
    }
    LandingLabels.prototype.render = function () {
        if (!this.hasLandings) {
            this.parent.append("text").attr("x", Settings.instance().width / 2).attr("y", Settings.instance().height / 2 - 165).text(Dictionary.getInstance().get("No Landings")).attr("class", "metricsValue metrics");
        }
        else {
            this.parent.append("text").attr("x", Settings.instance().width / 2).attr("y", Settings.instance().height / 2 - 165).text(Dictionary.getInstance().get("Landings")).attr("class", "metricsLabel metrics");
            this.parent.append("text").attr("x", Settings.instance().width / 2).attr("y", Settings.instance().height / 2 - 140).text(function (d) {
                return Settings.instance().NumberFormat(this.parentNode.parentNode.parentNode.__data__.landing);
            }).attr("id", "landingMetricsValue").attr("class", "metricsValue metrics");
        }
    };
    return LandingLabels;
})();
var OutgoingPaths = (function () {
    function OutgoingPaths(pathGroup, nextNodes) {
        this.pathGroup = pathGroup;
        this.nextNodes = nextNodes;
        this.lineMaker = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("linear");
        this.setupSubscribers();
    }
    OutgoingPaths.prototype.setupSubscribers = function () {
        Bus.instance().subscribe("mouseover", function (node, data) {
            d3.select(data.el).selectAll(".nextPath").attr("stroke", Settings.instance().SelectedColor);
            if (node.next) {
                d3.select("#exitpath" + node.id).attr("stroke", Settings.instance().SelectedColor);
            }
            else {
                d3.select(data.parent).selectAll(".nextPath").attr("stroke", Settings.instance().SelectedColor);
            }
        });
        Bus.instance().subscribe("mouseout", function (node, data) {
            d3.select(data.el).selectAll(".nextPath").attr("stroke", function (d) {
                if (State.instance().highLevelEntryEnabled()) {
                    return Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.efficiency);
            });
        });
    };
    OutgoingPaths.prototype.render = function () {
        var self = this;
        var strokeScale = Scales.getInstance().strokeScale;
        var generator = EntryPathGenerator.getInstance();
        var nextPaths = this.pathGroup.selectAll(".nextPath").data(function (d) {
            if (State.instance().highLevelEntryEnabled())
                return d.next.slice(0, 2);
            return d.next;
        }, function (p) { return p.id; });
        this.el = nextPaths.enter().append("svg:path").attr("id", function (d) {
            return "exitpath" + d.id;
        }).attr("d", function (d, i) {
            var index = ArrayHelper.findIndex(self.nextNodes, d.id);
            return self.lineMaker(generator.generateExit(index, self.nextNodes.length));
        }).attr("stroke", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            return Scales.getInstance().getEffiencyColor(d.efficiency);
        }).attr("stroke-width", function (d) {
            if (State.instance().highLevelExitEnabled()) {
                return 2;
            }
            return strokeScale(d.visits);
        }).attr("fill", "none").attr("class", "nextPath").on("click", function (d) {
            var args = { el: this, path: this.parentNode.__data__, parent: this.parentNode, x: d3.event.clientX, y: d3.event.clientY };
            Bus.instance().publish("mouseover", d, args);
            Bus.instance().publish("click", d, args);
        }).on("mouseover", function (d, i) {
            var sender = this;
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            self.hoverTimeoutId = setTimeout(function () {
                var args = { el: sender, path: sender.parentNode.__data__, parent: sender.parentNode, x: x, y: y };
                var datum = d;
                if (!d.id) {
                    datum = d.next[i];
                }
                Bus.instance().publish("mouseover", datum, args);
            }, Settings.instance().hoverTimeout);
        }).on("mouseout", function (d) {
            window.clearTimeout(self.hoverTimeoutId);
            var args = { el: this, path: this.parentNode.__data__ };
            Bus.instance().publish("mouseout", d, args);
        });
    };
    return OutgoingPaths;
})();
var OutgoingNode = (function () {
    function OutgoingNode(parent, nodes) {
        this.parent = parent;
        this.nodes = nodes;
        this.cssClass = "node nextNode";
        this.nodeYScale = d3.scale.linear().domain([0, nodes.length]).range([Settings.instance().topPadding, Settings.instance().height]);
    }
    OutgoingNode.prototype.render = function () {
        var self = this;
        var x = Settings.instance().width - Settings.instance().midPadding;
        this.el = this.parent.append("circle").attr("id", function (d) {
            return "node" + d.id;
        }).attr("cx", x).attr("cy", function (d) { return self.nodeYScale(self.nodes.indexOf(d)); }).attr("r", function (d) { return d.radius(); }).attr("style", function (d) { return d.style(); }).attr("stroke", function (d) { return d.stroke(); }).attr("stroke-width", function (d) { return d.strokeWidth(); }).attr("class", self.cssClass).classed("current", function (d) { return d.current; }).on("click", function (d) {
            var args = { el: this, path: this.parentNode.__data__, parent: this.parentNode, x: d3.event.clientX, y: d3.event.clientY };
            Bus.instance().publish("mouseover", d, args);
            Bus.instance().publish("click", d, args);
        }).on("mouseover", function (d) {
            var sender = this;
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            self.hoverTimeoutId = setTimeout(function () {
                var args = { el: sender, path: sender.parentNode.__data__, isNode: true, parent: sender.parentNode, x: x, y: y };
                Bus.instance().publish("mouseover", d, args);
            }, Settings.instance().hoverTimeout);
        }).on("mouseout", function (d) {
            window.clearTimeout(self.hoverTimeoutId);
            var args = { el: this, path: this.parentNode.__data__, self: this };
            Bus.instance().publish("mouseout", d, args);
        });
    };
    return OutgoingNode;
})();
var LandingGroup = (function () {
    function LandingGroup(parent) {
        this.parent = parent;
    }
    LandingGroup.prototype.render = function () {
        var self = this;
        var labelGroup = this.parent.selectAll("g").data(function (d) {
            return d.previous;
        });
        labelGroup.enter().append('g').attr("class", "metricsLabelGroup").attr("id", "arrowGroup").on("click", function (d) {
            var args = { el: this, path: this.parentNode.__data__, parent: this.parentNode, x: d3.event.clientX, y: d3.event.clientY };
            Bus.instance().publish("mouseover", d, args);
            Bus.instance().publish("click", d, args);
        }).on("mouseover", function (d, i) {
            var sender = this;
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            self.hoverTimeoutId = setTimeout(function () {
                var args = { el: sender, path: sender.parentNode.__data__, parent: sender.parentNode, x: x, y: y };
                var datum = d;
                if (!d.id) {
                    datum = d.next[i];
                }
                Bus.instance().publish("mouseover", datum, args);
            }, Settings.instance().hoverTimeout);
        }).on("mouseout", function (d) {
            window.clearTimeout(self.hoverTimeoutId);
            var args = { el: this, path: this.parentNode.__data__, parent: this.parentNode };
            Bus.instance().publish("mouseout", d, args);
        });
        labelGroup.exit().remove();
        return labelGroup;
    };
    return LandingGroup;
})();
var IncomingPaths = (function () {
    function IncomingPaths(pathGroup, pathCount, entryNodeCount) {
        this.pathGroup = pathGroup;
        this.pathCount = pathCount;
        this.entryNodeCount = entryNodeCount;
        this.strokeScale = Scales.getInstance().strokeScale;
        this.lineMaker = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("linear");
    }
    IncomingPaths.prototype.render = function () {
        var _this = this;
        var domain = [];
        for (var i = this.entryNodeCount - 1; i >= 0; i--) {
            domain.push(i);
        }
        this.nodeXScale = d3.scale.ordinal().domain(domain).rangePoints([0, Settings.instance().domainEndRange], 0.01);
        var self = this;
        this.pathGroup.append("path").attr("class", "prevPath").attr("d", function (d, i) {
            var start = self.nodeXScale(d.previous.length - 2);
            return self.lineMaker(EntryPathGenerator.getInstance().generate(i, self.pathCount, start));
        }).attr("stroke", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            return Scales.getInstance().getEffiencyColor(d.efficiency);
        }).attr("stroke-width", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return 2;
            }
            return _this.strokeScale(d.visits);
        }).attr("fill", "none").on("click", function (d) {
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            var data = d.previous[d.previous.length - 1];
            var args = { el: this, path: this.parentNode.__data__, parent: this.parentNode, x: x, y: y };
            Bus.instance().publish("mouseover", data, args);
            Bus.instance().publish("click", data, args);
        }).on("mouseover", function (d, i) {
            var sender = this;
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            self.hoverTimeoutId = setTimeout(function () {
                var args = { el: sender, path: sender.parentNode.__data__, parent: sender.parentNode, x: x, y: y };
                Bus.instance().publish("mouseover", d.previous[d.previous.length - 1], args);
            }, Settings.instance().hoverTimeout);
        }).on("mouseout", function (d) {
            window.clearTimeout(self.hoverTimeoutId);
            var args = { el: this, path: this.parentNode.__data__ };
            Bus.instance().publish("mouseout", d.previous[d.previous.length - 1], args);
        });
    };
    return IncomingPaths;
})();
var IncomingNode = (function () {
    function IncomingNode(parent, nodeXScale, nodeYScale) {
        this.parent = parent;
        this.nodeXScale = nodeXScale;
        this.nodeYScale = nodeYScale;
        this.cssClass = "node previousNode";
    }
    IncomingNode.prototype.render = function () {
        var _this = this;
        var self = this;
        this.el = this.parent.append("circle").attr("id", function (d) {
            return "node" + d.id;
        }).attr("cx", function (d, i) {
            return self.nodeXScale(i);
        }).attr("cy", function (d, i, j) { return _this.nodeYScale(j); }).attr("r", function (d) { return d.radius(); }).attr("style", function (d) { return d.style(); }).attr("stroke", function (d) { return d.stroke(); }).attr("stroke-width", function (d) { return d.strokeWidth(); }).attr("class", self.cssClass).classed("current", function (d) { return d.current; }).on("click", function (d) {
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            var args = { el: this, path: this.parentNode.__data__, isNode: true, parent: this.parentNode, x: x, y: y };
            Bus.instance().publish("mouseover", d, args);
            Bus.instance().publish("click", d, args);
        }).on("mouseover", function (d, i) {
            var sender = this;
            var x = d3.event.clientX;
            var y = d3.event.clientY;
            self.hoverTimeoutId = setTimeout(function () {
                var args = { el: sender, path: sender.parentNode.__data__, isNode: true, parent: sender.parentNode, x: x, y: y };
                Bus.instance().publish("mouseover", d, args);
            }, Settings.instance().hoverTimeout);
        }).on("mouseout", function (d) {
            window.clearTimeout(self.hoverTimeoutId);
            var args = { el: this, path: this.parentNode.__data__, self: this };
            Bus.instance().publish("mouseout", d, args);
        });
    };
    return IncomingNode;
})();
var StubDictionary = (function () {
    function StubDictionary() {
    }
    StubDictionary.prototype.get = function (key) {
        return key;
    };
    return StubDictionary;
})();
var EntryPathGenerator = (function () {
    function EntryPathGenerator() {
        this.topPadding = Settings.instance().topPadding;
        this.midPadding = Settings.instance().midPadding;
        this.leftPadding = Settings.instance().leftPadding;
        this.w = Settings.instance().width;
        this.h = Settings.instance().height;
    }
    EntryPathGenerator.init = function () {
        if (EntryPathGenerator._instance === null) {
            EntryPathGenerator._instance = new EntryPathGenerator();
        }
        return EntryPathGenerator._instance;
    };
    EntryPathGenerator.getInstance = function () {
        return EntryPathGenerator._instance;
    };
    EntryPathGenerator.prototype.generate = function (index, length, start) {
        var yScale = d3.scale.linear().domain([0, length]).range([this.topPadding, this.h]);
        var y = yScale(index);
        return this.getLine2(start, y);
    };
    EntryPathGenerator.prototype.generateExit = function (index, length) {
        var yScale = d3.scale.linear().domain([0, length]).range([this.topPadding, this.h]);
        return this.getExitLine(yScale(index));
    };
    EntryPathGenerator.prototype.getLine2 = function (x, y) {
        return [{ "x": x, "y": y }, { "x": this.w / 2 - this.midPadding, "y": y }, { "x": this.w / 2, "y": this.h / 2 }];
    };
    EntryPathGenerator.prototype.getLine = function (y) {
        return [{ "x": this.leftPadding, "y": y }, { "x": this.w / 2 - this.midPadding, "y": y }, { "x": this.w / 2, "y": this.h / 2 }];
    };
    EntryPathGenerator.prototype.getExitLine = function (y) {
        return [{ "x": this.w / 2, "y": this.h / 2 }, { "x": this.w / 2 + this.midPadding, "y": y }, { "x": this.w - this.midPadding, "y": y }];
    };
    EntryPathGenerator._instance = null;
    return EntryPathGenerator;
})();
var ArrayHelper = (function () {
    function ArrayHelper() {
    }
    ArrayHelper.findNode = function (source, id) {
        var match = $.grep(source, function (e) {
            return e.id === id;
        });
        if (match.length > 0) {
            return match[0];
        }
        return null;
    };
    ArrayHelper.findIndex = function (source, id) {
        var indexes = $.map(source, function (obj, index) {
            if (obj.id == id) {
                return index;
            }
        });
        if (indexes.length > 0)
            return indexes[0];
        return -1;
    };
    ArrayHelper.getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return "";
        else
            return decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    return ArrayHelper;
})();
var StubServiceUriResolver = (function () {
    function StubServiceUriResolver(uriStem) {
        this.uriStem = uriStem;
    }
    StubServiceUriResolver.prototype.resolve = function () {
        var datasetName = $('input[name=dataRadios]:checked', '#myForm').val();
        return this.uriStem + datasetName + '.js';
    };
    return StubServiceUriResolver;
})();
var ServiceUriResolver = (function () {
    function ServiceUriResolver(uriStem, mapId, startDate, endDate) {
        this.uriStem = uriStem;
        this.mapId = mapId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.setupSubscribers();
    }
    ServiceUriResolver.prototype.setupSubscribers = function () {
        var self = this;
        Bus.instance().subscribe("query:changed", function (data) {
            self.mapId = data.treeId;
            self.startDate = data.startDate;
            self.endDate = data.endDate;
        }, true);
    };
    ServiceUriResolver.prototype.resolve = function () {
        var itemId = ArrayHelper.getParameterByName("id");
        if (!itemId) {
            throw new Error("Error: id query string parameter wasn't supplied.");
        }
        return this.uriStem + "?treedefinitionid=" + this.mapId + "&itemid=" + itemId + "&start=" + this.startDate + "&end=" + this.endDate;
    };
    return ServiceUriResolver;
})();
var DatasetSelector = (function () {
    function DatasetSelector() {
    }
    DatasetSelector.render = function (el) {
        el.selectAll("input.data").on("change", function () {
            var datasetName = d3.select(this).attr("value");
            Bus.instance().publish("stub:datasetchanged", datasetName);
        });
    };
    return DatasetSelector;
})();
var OutgoingLabels = (function () {
    function OutgoingLabels(el, nodes) {
        this.el = el;
        this.nodes = nodes;
        this.getNodesFunc = Path.getPreviousNodes;
        this.fixedYPosition = 0;
        this.fixedXPosition = Settings.instance().width - Settings.instance().midPadding;
        this.nodeYScale = d3.scale.linear().domain([0, nodes.length]).range([Settings.instance().topPadding, Settings.instance().height]);
        this.setupSubscribers();
    }
    OutgoingLabels.prototype.render = function () {
        var self = this;
        self.el.selectAll(".outgoingLabel").data(function (d) { return d.next; }).enter().append("text").text(function (d) {
            if (d.name.length > 25)
                return d.name.substring(0, 25) + "...";
            return d.name;
        }).attr({
            transform: function (d) {
                var x = self.fixedXPosition + 10 + d.radius();
                var y = self.nodeYScale(self.nodes.indexOf(d));
                return "translate(" + x + ", " + y + ") rotate(320)";
            },
            "class": "outgoingLabel nodeLabel",
            id: function (d) {
                return "label" + d.id;
            }
        }).style("opacity", 0);
    };
    OutgoingLabels.prototype.setupSubscribers = function () {
        var _this = this;
        var self = this;
        Bus.instance().subscribe("exit:mouseout", function () {
            _this.off();
        });
        Bus.instance().subscribe("mouseout", function () {
            _this.off();
        });
        Bus.instance().subscribe("reset", function () {
            _this.off();
        });
        Bus.instance().subscribe("mouseover", function (node, data) {
            var nodeLabelContainerSelection;
            if (node.next) {
                nodeLabelContainerSelection = d3.select("#label" + node.id);
            }
            else {
                nodeLabelContainerSelection = d3.select(data.parent).selectAll(".outgoingLabel");
            }
            self.on(nodeLabelContainerSelection);
        });
    };
    OutgoingLabels.prototype.off = function () {
        d3.selectAll(".outgoingLabel").transition().style("opacity", 0);
    };
    OutgoingLabels.prototype.on = function (labelEl) {
        labelEl.transition().style("opacity", 1);
    };
    return OutgoingLabels;
})();
var IncomingLabels = (function () {
    function IncomingLabels(el, pathLength, maxEntryNodeCount) {
        this.el = el;
        this.getNodesFunc = Path.getPreviousNodes;
        this.setupSubscribers();
        var domain = [];
        for (var i = maxEntryNodeCount - 1; i >= 0; i--) {
            domain.push(i);
        }
        this.nodeXScale = d3.scale.ordinal().domain(domain).rangePoints([0, Settings.instance().domainEndRange], 0.1);
        this.nodeYScale = d3.scale.linear().domain([0, pathLength]).range([Settings.instance().topPadding, Settings.instance().height]);
    }
    IncomingLabels.prototype.setupSubscribers = function () {
        var _this = this;
        Bus.instance().subscribe("exit:mouseout", function () {
            _this.off();
        });
        Bus.instance().subscribe("mouseover", function (node, data) {
            _this.on(data.parent);
        });
        Bus.instance().subscribe("mouseout", function () {
            _this.off();
        });
    };
    IncomingLabels.prototype.off = function () {
        d3.selectAll(".incomingLabel").transition().style("opacity", 0);
    };
    IncomingLabels.prototype.on = function (el) {
        d3.select(el).selectAll(".incomingLabel").transition().style("opacity", 1);
    };
    IncomingLabels.prototype.render = function () {
        var _this = this;
        var self = this;
        self.el.selectAll("text.incomingLabel").data(function (d) { return _this.getNodesFunc(d).reverse(); }).enter().append("text").text(function (d) {
            if (d.name.length > 25)
                return d.name.substring(0, 25) + "...";
            return d.name;
        }).attr({
            transform: function (d, i, j) {
                var x = self.nodeXScale(i) + 10;
                var y = self.nodeYScale(j) - 17 - d.radius() / 3;
                return "translate(" + x + ", " + y + ") rotate(320)";
            },
            "class": "incomingLabel nodeLabel",
            id: function (d) {
                return "label" + d.id;
            }
        }).style("opacity", 0);
    };
    return IncomingLabels;
})();
var IncomingNodes = (function () {
    function IncomingNodes(el, pathLength, maxEntryNodeCount) {
        this.el = el;
        this.getNodesFunc = Path.getPreviousNodes;
        this.selector = ".previousNodes";
        var domain = [];
        for (var i = maxEntryNodeCount - 1; i >= 0; i--) {
            domain.push(i);
        }
        this.nodeXScale = d3.scale.ordinal().domain(domain).rangePoints([0, Settings.instance().domainEndRange], 0.1);
        this.nodeYScale = d3.scale.linear().domain([0, pathLength]).range([Settings.instance().topPadding, Settings.instance().height]);
        this.setupSubscribers();
    }
    IncomingNodes.prototype.setupSubscribers = function () {
        var _this = this;
        Bus.instance().subscribe("exit:mouseout", function () {
            _this.reset();
        });
        Bus.instance().subscribe("mouseout", function () {
            _this.reset();
        });
        Bus.instance().subscribe("exit:mouseover", function () {
            var DimColor = Settings.instance().DimColor;
            var SelectedColor = Settings.instance().SelectedColor;
            d3.selectAll("circle.previousNode").attr("stroke", null).attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + SelectedColor;
                }
            }).classed("selected", function () {
                return this.parentNode.__data__.isExit;
            }).classed("dimmed", function () {
                return !this.parentNode.__data__.isExit;
            });
            d3.selectAll("circle.nextNode").attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + DimColor;
                }
            }).classed("dimmed", true);
        });
        Bus.instance().subscribe("mouseover", function (node, data) {
            var DimColor = Settings.instance().DimColor;
            var SelectedColor = Settings.instance().SelectedColor;
            d3.selectAll("circle.node").attr("stroke", null).attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + DimColor;
                }
            }).classed("dimmed", true);
            d3.select(data.parent).selectAll("circle.previousNode").attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + SelectedColor;
                }
            }).classed("dimmed", false).classed("selected", true);
            if (node.next) {
                var id = "#node" + node.id;
                d3.select(id).attr("style", function () {
                    if (State.instance().highLevelEntryEnabled() || State.instance().highLevelExitEnabled()) {
                        return "fill:" + SelectedColor;
                    }
                }).classed("dimmed", false).classed("selected", true);
            }
            else {
                d3.select(data.parent).selectAll("circle.nextNode").attr("style", function () {
                    if (State.instance().highLevelEntryEnabled() || State.instance().highLevelExitEnabled()) {
                        return "fill:" + SelectedColor;
                    }
                }).classed("dimmed", false).classed("selected", true);
            }
        });
    };
    IncomingNodes.prototype.reset = function () {
        d3.selectAll("circle.node").classed("dimmed", false).classed("selected", false).classed("current", function (d) {
            return d.current;
        }).attr("style", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return "fill:" + Settings.instance().NoDetailsColor;
            }
            if (d.next && State.instance().highLevelExitEnabled()) {
                return "fill:" + Scales.getInstance().getEffiencyColor(d.efficiency);
            }
        }).attr("stroke", function (d, i) {
            if (!d.current && State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            if (!d.current) {
                return Scales.getInstance().getEffiencyColor(d.efficiency);
            }
            return null;
        });
    };
    IncomingNodes.prototype.render = function () {
        var _this = this;
        var self = this;
        var nodes = self.el.selectAll(this.selector).data(function (d) { return _this.getNodesFunc(d).reverse(); });
        nodes.enter().call(function (d) {
            var node = new IncomingNode(d, _this.nodeXScale, _this.nodeYScale);
            node.render();
        });
    };
    return IncomingNodes;
})();
var Metrics = (function () {
    function Metrics(el) {
        this.el = el;
        this.init();
    }
    Metrics.prototype.init = function () {
        var self = this;
        Bus.instance().subscribe("mouseover", function (node, data) {
            var metrics = MetricHelper.create(data.path.visits, data.path.value);
            self.el.selectAll(".currentMetric").transition().delay(300).tween("text", function (d) {
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
        Bus.instance().subscribe("mouseout", function (node) {
            self.el.selectAll(".currentMetric").transition().delay(300).tween("text", function (d) {
                var newValue = d.displayValue.replace(/,/g, "");
                var prevValue = this.textContent.replace(/,/g, "");
                var interpolator = d3.interpolateRound(+prevValue, +newValue);
                var format = d3.format("0,000");
                return function (t) {
                    this.textContent = format(interpolator(t));
                };
            });
        });
        Bus.instance().subscribe("data:loaded", function (data) {
            if (!data) {
                self.remove();
            }
            self.render(data);
        });
        Bus.instance().subscribe("data:updated", function (data) {
            if (!data) {
                self.remove();
            }
            self.render(data);
        });
        Bus.instance().subscribe("data:error", function () {
            self.remove();
        });
        Bus.instance().subscribe("data:empty", function () {
            self.remove();
        });
    };
    Metrics.prototype.remove = function () {
        this.el.selectAll("div").remove();
    };
    Metrics.prototype.render = function (data) {
        this.remove();
        var metrics = MetricHelper.create(data.visits, data.value);
        var metricsSelection = this.el.selectAll("div").data(metrics);
        metricsSelection.enter().append("div").attr("id", function (d) { return d.id; }).append("span").text(function (d) { return d.displayLabel; }).append("h3").text(function (d) { return d.displayValue; }).classed("currentMetric", true);
    };
    return Metrics;
})();
var Tooltip = (function () {
    function Tooltip(el, cssClass, opacity) {
        if (cssClass === void 0) { cssClass = "tooltip"; }
        if (opacity === void 0) { opacity = 0; }
        this.el = el;
        this.cssClass = cssClass;
        this.opacity = opacity;
        this.setupSubscribers();
    }
    Tooltip.prototype.render = function () {
        this.el.append("div").attr("class", this.cssClass).style("opacity", this.opacity);
    };
    Tooltip.prototype.setupSubscribers = function () {
        var self = this;
        Bus.instance().subscribe("mouseover", function (node, data) {
            if (State.pathSelected) {
                var isOnSelected = d3.select(data.el).classed("selected");
                if (!isOnSelected) {
                    return;
                }
            }
            if (data.parent && data.isNode) {
                var tooltip = d3.selectAll(".tooltip");
                if (tooltip) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    var toolTipText = "<strong>" + node.name + "</strong>" + "<span class='url'>" + node.url + "</span><br/>" + Dictionary.getInstance().get("Value") + ": " + node.value + "<br/>" + Dictionary.getInstance().get("Visits") + ": " + node.visits;
                    tooltip.html(toolTipText).style("left", (data.x + 5) + "px").style("top", (data.y + 5) + "px");
                }
            }
        }, true);
        Bus.instance().subscribe("mouseout", function () {
            self.off();
        }, true);
    };
    Tooltip.prototype.off = function () {
        var tooltip = d3.selectAll(".tooltip");
        if (tooltip) {
            tooltip.transition().duration(500).style("opacity", 0);
        }
    };
    return Tooltip;
})();
var Breadcrumb = (function () {
    function Breadcrumb(el) {
        this.el = el;
        this.idSelector = "#breadcrumb";
        this.cssSelector = ".breadcrumb";
        this.init();
    }
    Breadcrumb.prototype.render = function () {
    };
    Breadcrumb.prototype.init = function () {
        var self = this;
        Bus.instance().subscribe("mouseover", function (node, data) {
            var breadcrumb = d3.select(self.idSelector);
            var nodes = data.path.previous.slice(0);
            if (node.next) {
                nodes.push(node);
            }
            if (breadcrumb && nodes) {
                var bc = breadcrumb.select(self.cssSelector);
                bc.selectAll("li").remove();
                nodes.forEach(function (n) {
                    bc.append("li").classed("current", n.current).text(n.name);
                });
            }
        });
        Bus.instance().subscribe("mouseout", function (node) {
            var breadcrumb = d3.select(self.idSelector);
            if (breadcrumb) {
                var selector = breadcrumb.select(self.cssSelector);
                selector.selectAll("li").remove();
                selector.append("li").text(Dictionary.getInstance().get("Please select a path"));
            }
        });
    };
    return Breadcrumb;
})();
var FilterBar = (function () {
    function FilterBar(el) {
        this.el = el;
        this.filter = new Filter("visits", true, 10);
        this.id = "filterBar";
        this.init();
    }
    FilterBar.prototype.render = function () {
    };
    FilterBar.prototype.init = function () {
        var self = this;
        this.el.selectAll("input.filter").on("change", function () {
            var take = d3.select(this).attr("data-take");
            var desc = d3.select(this).attr("data-desc");
            self.filter.take = parseInt(take);
            self.filter.desc = desc === 'true';
            Bus.instance().publish("reset", this, { ignoreMute: true });
        });
        this.el.selectAll("input.sort").on("change", function () {
            self.filter.sortBy = this.value;
            Bus.instance().publish("sort:changed", this, { ignoreMute: true });
        });
    };
    return FilterBar;
})();
var Icon = (function () {
    function Icon(el, iconWidth, iconHeight) {
        this.el = el;
        this.iconWidth = iconWidth;
        this.iconHeight = iconHeight;
        this.barCount = 5;
        this.w = Settings.instance().width;
        this.h = Settings.instance().height;
        this.thickness = this.iconWidth / 10;
        this.topRightCornerSize = this.iconWidth / 4;
        this.topPixelAdjustment = this.thickness / 2;
        this.bottomPixAdjustment = this.thickness / 10;
        this.innerBarPadding = this.thickness / 2;
        this.innerBarX = this.w / 2 - this.iconWidth / 2 + this.thickness + this.innerBarPadding * 2;
        this.innerBarY = this.h - this.thickness * 2 - this.innerBarPadding * 2;
        this.innerBarWidth = this.iconWidth / 2 + this.thickness;
        this.topInnerBarWidth = this.innerBarWidth - this.topRightCornerSize + this.innerBarPadding;
        this.spacing = this.thickness * (1.7 + (this.iconHeight - this.iconWidth) * 0.02);
        this.pathinfo = [{ x: this.w / 2 + this.iconWidth / 2 - this.topRightCornerSize + this.topPixelAdjustment, y: this.h / 2 - this.iconHeight / 2 }, { x: this.w / 2 - this.iconWidth / 2, y: this.h / 2 - this.iconHeight / 2 }, { x: this.w / 2 - this.iconWidth / 2, y: this.h / 2 + this.iconHeight / 2 }, { x: this.w / 2 + this.iconWidth / 2, y: this.h / 2 + this.iconHeight / 2 }, { x: this.w / 2 + this.iconWidth / 2, y: this.h / 2 - this.iconHeight / 2 + this.topRightCornerSize }, { x: this.w / 2 + this.iconWidth / 2 - this.topRightCornerSize + this.bottomPixAdjustment, y: this.h / 2 - this.iconHeight / 2 }];
    }
    Icon.prototype.render = function () {
        this.drawFrame();
        this.drawInnerBars();
    };
    Icon.prototype.drawFrame = function () {
        var lineMaker = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("linear");
        this.el.append("svg:path").attr('d', lineMaker(this.pathinfo)).attr('class', 'frame');
    };
    Icon.prototype.drawInnerBars = function () {
        var _this = this;
        var yScale = d3.scale.linear().domain([0, this.barCount]).range([this.innerBarY / 2 - this.spacing, this.innerBarY / 2 + this.iconHeight - this.spacing * 3]);
        for (var index = 0; index < this.barCount; index++) {
            this.el.append("rect").attr("x", this.innerBarX).attr("y", function (d, i) {
                return yScale(index);
            }).attr("width", function () {
                if (index === 0)
                    return _this.topInnerBarWidth;
                return _this.innerBarWidth;
            }).attr("height", this.thickness).attr("class", "innerBar");
        }
        ;
    };
    return Icon;
})();
var Landings = (function () {
    function Landings(el) {
        this.el = el;
        this.setupSubscribers();
    }
    Landings.prototype.render = function () {
        var data = this.el[0][0].__data__;
        this.update(data.paths);
    };
    Landings.prototype.update = function (paths) {
        paths = Filter.getInstance().process(paths);
        this.nextNodes = d3.merge(paths.map(function (p) {
            if (State.instance().highLevelEntryEnabled())
                return p.next.slice(0, 2);
            return p.next;
        }));
        var landingPaths = paths.filter(function (d) { return d.isLanding; });
        if (landingPaths.length > 0) {
            this.renderLandingPaths(landingPaths);
        }
        else {
            this.renderNoLandingPaths(landingPaths);
        }
    };
    Landings.prototype.renderNoLandingPaths = function (paths) {
        var group = new LandingGroup(this.renderGroup(paths)).render();
        new LandingLabels(group, false).render();
    };
    Landings.prototype.renderLandingPaths = function (paths) {
        this.color = Scales.getInstance().getEffiencyColor(paths[0].efficiency);
        var g = this.renderGroup(paths);
        var labelGroup = new LandingGroup(g).render();
        new LandingLabels(labelGroup, true).render();
        new LandingMarker(labelGroup, this.color).render();
        new OutgoingPaths(g, this.nextNodes).render();
        new OutgoingNodes(g, this.nextNodes).render();
        new OutgoingLabels(g, this.nextNodes).render();
    };
    Landings.prototype.renderGroup = function (landingPaths) {
        var g = this.el.selectAll(".landing").data(landingPaths);
        g.selectAll("path").remove();
        g.selectAll("circle").remove();
        g.selectAll(".metricsLabelGroup").remove();
        g.enter().append('g').attr("class", "landing");
        g.exit().remove();
        return g;
    };
    Landings.prototype.setupSubscribers = function () {
        var self = this;
        Bus.instance().subscribe("exit:mouseover", function () {
            self.off();
        });
        Bus.instance().subscribe("exit:mouseout", function () {
            self.reset();
        });
        Bus.instance().subscribe("mouseout", function () {
            self.reset();
        });
        Bus.instance().subscribe("data:updated", function () {
            self.render();
        });
        Bus.instance().subscribe("reset", function () {
            self.render();
        });
        Bus.instance().subscribe("sort:changed", function () {
            self.render();
        });
        Bus.instance().subscribe("mouseover", function (node, data) {
            if (data.path.isLanding) {
                self.on(node);
                self.el.select("#landingMetricsValue").text(Settings.instance().NumberFormat(node.visits));
            }
            else {
                self.off();
            }
        });
    };
    Landings.prototype.off = function () {
        this.el.selectAll(".arrow").attr("fill", Settings.instance().DimColor);
        this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
        this.el.selectAll(".nextPath").attr("stroke", Settings.instance().DimColor);
        this.el.selectAll(".metrics").attr("opacity", "0");
    };
    Landings.prototype.on = function (activationNode) {
        this.el.selectAll(".arrow").attr("fill", Settings.instance().SelectedColor);
        this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", true);
        this.el.selectAll(".metrics").attr("opacity", "1");
        if (activationNode.next) {
            this.el.selectAll(".nextPath").attr("stroke", Settings.instance().DimColor);
            var exitPathId = "#exitpath" + activationNode.id;
            this.el.selectAll(exitPathId).attr("stroke", Settings.instance().SelectedColor);
        }
        else {
            this.el.selectAll(".nextPath").attr("stroke", Settings.instance().SelectedColor);
        }
    };
    Landings.prototype.reset = function () {
        var _this = this;
        var self = this;
        self.el.selectAll(".arrow").attr("fill", function () {
            if (State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            return _this.color;
        });
        self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
        self.el.selectAll(".metrics").attr("opacity", "1");
        self.el.selectAll(".nextPath").attr("stroke", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            return Scales.getInstance().getEffiencyColor(d.efficiency);
        });
        self.el.select("#landingMetricsValue").text(function (d) {
            return Settings.instance().NumberFormat(this.parentNode.parentNode.parentNode.__data__.landing);
        });
    };
    return Landings;
})();
var Exits = (function () {
    function Exits(el) {
        this.el = el;
        this.setupSubscribers();
    }
    Exits.prototype.render = function () {
        this.el.selectAll(".exit").remove();
        var g = this.el.append('g').attr("class", "exit").style("visibility", function (d) { return (d.exitcount === 0 ? "hidden" : "visible"); });
        var labelGroup = new ExitGroup(g).render();
        new ExitLabels(labelGroup).render();
        new ExitMarker(labelGroup).render();
    };
    Exits.prototype.off = function () {
        this.el.selectAll(".arrow").attr("fill", Settings.instance().DimColor);
        this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
        this.el.selectAll(".metrics").attr("opacity", "0");
    };
    Exits.prototype.on = function (exitcount, exitpotential) {
        this.el.selectAll(".arrow").attr("fill", Settings.instance().SelectedColor);
        this.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", true);
        this.el.select("#exitCount").text(Settings.instance().NumberFormat(exitcount));
        this.el.select("#exitPotential").text(d3.round(exitpotential, 3));
        this.el.selectAll(".metrics").attr("opacity", "1");
    };
    Exits.prototype.setupSubscribers = function () {
        var _this = this;
        var self = this;
        Bus.instance().subscribe("mouseover", function (node, data) {
            if (node.next) {
                self.off();
                return;
            }
            var isExitingPath = data.parent && data.parent.__data__ && data.parent.__data__.isExit;
            if (isExitingPath) {
                self.on(data.path.exitcount, data.path.exitpotential);
            }
            else {
                self.off();
            }
        });
        Bus.instance().subscribe("mouseout", function (node, data) {
            self.el.selectAll(".arrow").attr("fill", function (d) {
                if (State.instance().highLevelEntryEnabled()) {
                    return Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.averageExitingPathEfficiency);
            });
            self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
            self.el.select("#exitCount").text(function (d) {
                return Settings.instance().NumberFormat(this.parentNode.parentNode.parentNode.__data__.exitcount);
            });
            self.el.select("#exitPotential").text(function (d) {
                return d3.round(this.parentNode.parentNode.parentNode.__data__.exitpotential, 3);
            });
            self.el.selectAll(".metrics").attr("opacity", "1");
        });
        Bus.instance().subscribe("exit:mouseover", function (node, data) {
            self.el.selectAll(".arrow").attr("fill", Settings.instance().SelectedColor);
            self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", true);
        });
        Bus.instance().subscribe("exit:mouseout", function (node, data) {
            self.el.selectAll(".arrow").attr("fill", function (d) {
                if (State.instance().highLevelEntryEnabled()) {
                    return Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.averageExitingPathEfficiency);
            });
            self.el.selectAll(".metricsLabelGroup").selectAll("text").classed("activeLabel", false);
        });
        Bus.instance().subscribe("reset", function () {
            _this.render();
        });
    };
    return Exits;
})();
var Body = (function () {
    function Body(el) {
        this.el = el;
        this.lineMaker = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
            return d.y;
        }).interpolate("linear");
        this.setupSubscribers();
    }
    Body.prototype.setupSubscribers = function () {
        var _this = this;
        var self = this;
        Bus.instance().subscribe("exit:mouseover", function () {
            _this.el.selectAll(".nonlanding").selectAll("path").classed("muted", true).classed("selected", false);
            _this.el.selectAll(".prevPath").classed("muted", function (d) {
                return !d.isExit;
            }).classed("selected", function (d) {
                return d.isExit;
            });
        });
        Bus.instance().subscribe("reset", function () {
            _this.render();
        });
        Bus.instance().subscribe("data:updated", function (data) {
            _this.update(data.paths);
        });
        Bus.instance().subscribe("sort:changed", function () {
            _this.render();
        });
        Bus.instance().subscribe("exit:mouseout", function () {
            self.el.selectAll(".nonlanding").selectAll("path").attr("stroke", function (d) {
                if (State.instance().highLevelEntryEnabled()) {
                    return Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.efficiency);
            });
        });
        Bus.instance().subscribe("mouseover", function (node, data) {
            self.el.selectAll(".nonlanding").selectAll("path").attr("stroke", Settings.instance().DimColor);
            d3.select(data.parent).selectAll(".prevPath").attr("stroke", Settings.instance().SelectedColor);
        });
        Bus.instance().subscribe("mouseout", function (node, data) {
            d3.selectAll(".nonlanding").selectAll("path").attr("stroke", function (d) {
                if (State.instance().highLevelEntryEnabled()) {
                    return Settings.instance().NoDetailsColor;
                }
                return Scales.getInstance().getEffiencyColor(d.efficiency);
            });
        });
    };
    Body.prototype.render = function () {
        this.update(this.el[0][0].__data__.paths);
    };
    Body.prototype.update = function (paths) {
        var paths = Filter.getInstance().process(paths);
        var nonLanding = paths.filter(function (p) { return !p.isLanding; });
        var pathGroup = this.el.selectAll(".nonlanding").data(nonLanding, function (p) {
            var id = p.previous.map(function (p) {
                return p.id;
            }).join('-');
            return id;
        });
        pathGroup.selectAll("path").remove();
        pathGroup.selectAll("circle").remove();
        pathGroup.selectAll("text").remove();
        pathGroup.enter().append("g").attr("id", function (p) { return "group" + p.id; }).attr("class", "nonlanding");
        pathGroup.exit().remove();
        this.renderLeft(pathGroup, nonLanding);
        this.renderRight(pathGroup, paths);
    };
    Body.prototype.renderLeft = function (pathGroup, paths) {
        var entryNodeCount = d3.max(paths.map(function (a) {
            return a.previous.length;
        }));
        var pathCount = paths.length;
        new IncomingPaths(pathGroup, pathCount, entryNodeCount).render();
        new IncomingNodes(pathGroup, pathCount, entryNodeCount).render();
        new IncomingLabels(pathGroup, pathCount, entryNodeCount).render();
    };
    Body.prototype.renderRight = function (pathGroup, paths) {
        var nextNodes = d3.merge(paths.map(function (p) {
            if (State.instance().highLevelEntryEnabled())
                return p.next.slice(0, 2);
            return p.next;
        }));
        new OutgoingPaths(pathGroup, nextNodes).render();
        new OutgoingNodes(pathGroup, nextNodes).render();
        new OutgoingLabels(pathGroup, nextNodes).render();
    };
    return Body;
})();
var Knob = (function () {
    function Knob(el, radius, pageName) {
        this.el = el;
        this.radius = radius;
        this.pageName = pageName;
        this.setupSubscribers();
    }
    Knob.prototype.setupSubscribers = function () {
        var _this = this;
        var self = this;
        Bus.instance().subscribe("click", function () {
            _this.el.select(".back").style("opacity", "1");
        });
        Bus.instance().subscribe("reset", function () {
            self.off();
            _this.el.select(".back").style("opacity", "0");
        });
        Bus.instance().subscribe("mouseover", function () {
            self.on();
        });
        Bus.instance().subscribe("exit:mouseover", function () {
            self.on();
        });
        Bus.instance().subscribe("exit:mouseout", function () {
            self.off();
        });
        Bus.instance().subscribe("mouseout", function () {
            self.off();
        });
    };
    Knob.prototype.on = function () {
        this.el.selectAll("#inner-ring").classed("selected", true);
        this.el.select("#current-page-name").classed("selected", true);
    };
    Knob.prototype.off = function () {
        this.el.selectAll("#inner-ring").classed("selected", false);
        this.el.select("#current-page-name").classed("selected", false);
    };
    Knob.prototype.render = function () {
        var self = this;
        this.el.append("circle").attr("cx", Settings.instance().width / 2).attr("cy", Settings.instance().height / 2).attr("r", this.radius).attr("stroke-width", 1).attr("stroke-dasharray", "5,5").attr("fill", "white").attr("id", "inner-ring");
        this.el.append("circle").attr("cx", Settings.instance().width / 2 - 60).attr("cy", Settings.instance().height / 2).attr("r", 18).attr("class", "back").on("click", function () {
            State.pathSelected = false;
            Bus.instance().publish("reset");
        }).style("opacity", "0");
        this.el.append("text").attr("id", "current-page-name").attr("x", Settings.instance().width / 2).attr("y", Settings.instance().height / 2 - 43).text(function () {
            if (!self.pageName) {
                return "";
            }
            if (self.pageName.length > 10)
                return self.pageName.substring(0, 10) + "...";
            return self.pageName;
        });
    };
    return Knob;
})();
var Ring = (function () {
    function Ring(el, radius) {
        this.el = el;
        this.radius = radius;
    }
    Ring.prototype.render = function () {
        this.el.append("circle").attr("cx", function () {
            return Settings.instance().width / 2;
        }).attr("cy", function () {
            return Settings.instance().height / 2;
        }).attr("r", this.radius).style("stroke", Settings.instance().DimColor).style("stroke-width", 2).attr("fill", "#FFFFFF");
    };
    return Ring;
})();
var Spider = (function () {
    function Spider(el, pageName) {
        this.el = el;
        this.pageName = pageName;
    }
    Spider.prototype.render = function () {
        EntryPathGenerator.init();
        var pathGroupClass = "pathgroup";
        var ringGroup = this.el.append("g").attr("id", "ring");
        var pathGroup = this.el.append("g").attr("id", "paths").classed(pathGroupClass, true);
        var landingPathGroup = this.el.append("g").attr("id", "landingPath").classed(pathGroupClass, true);
        var exitPathGroup = this.el.append("g").attr("id", "exitPath").classed(pathGroupClass, true);
        var knobGroup = this.el.append("g").attr("id", "knob");
        var iconGroup = this.el.append("g").attr("id", "icon");
        new Icon(iconGroup, 55, 60).render();
        new Knob(knobGroup, 90, this.pageName).render();
        new Ring(ringGroup, 120).render();
        new Body(pathGroup).render();
        new Landings(landingPathGroup).render();
        new Exits(exitPathGroup).render();
    };
    return Spider;
})();
var Application = (function () {
    function Application(height, width, uriResolver, sourceDictionary) {
        if (uriResolver === void 0) { uriResolver = new StubServiceUriResolver("/data/"); }
        if (sourceDictionary === void 0) { sourceDictionary = new StubDictionary(); }
        this.height = height;
        this.width = width;
        this.uriResolver = uriResolver;
        this.sourceDictionary = sourceDictionary;
    }
    Application.prototype.initialize = function () {
        this.init();
        this.loadData();
    };
    Application.prototype.setupSubscribers = function () {
        var _this = this;
        Bus.instance().subscribe("data:loaded", function (data) {
            _this.handleDataLoad(data);
        });
        Bus.instance().subscribe("data:updated", function (data) {
            _this.handleDataLoad(data);
        });
        Bus.instance().subscribe("query:changed", function () {
            _this.loadData(true);
        });
        Bus.instance().subscribe("stub:datasetchanged", function () {
            _this.loadData(true);
        });
        Bus.instance().subscribe("sort:changed", function () {
            State.pathSelected = false;
        });
    };
    Application.prototype.handleDataLoad = function (data) {
        Scales.getInstance().load(data);
        d3.selectAll("#viz").call(this.render, { data: data, app: this });
    };
    Application.prototype.loadData = function (update) {
        var _this = this;
        if (update === void 0) { update = false; }
        var serviceUri = this.uriResolver.resolve();
        var token = this.getToken();
        d3.json(serviceUri).header("X-RequestVerificationToken", token).header("X-Requested-With", "XMLHttpRequest").get(function (err, data) { return _this.processData(err, data, update); });
    };
    Application.prototype.init = function () {
        Settings.init(this.height, this.width);
        State.init();
        Dictionary.init(this.sourceDictionary);
        Scales.init(this.width, this.height);
        this.setupSubscribers();
        DatasetSelector.render(d3.select("#dataset"));
        new Metrics(d3.select("#pageMetrics"));
        new Tooltip(d3.select("body")).render();
        new Breadcrumb(d3.select("#breadcrumb")).render();
        new FilterBar(d3.select("#filterBar")).render();
    };
    Application.prototype.render = function (viz, parameters) {
        var data = parameters.data;
        var app = parameters.app;
        var spiderSelection = viz.selectAll("g").data([data]);
        spiderSelection.enter().append("g").attr("id", "spider");
        spiderSelection.append("rect").attr({ "class": "overlay", "width": app.width, "height": app.height }).on("click", function () {
            State.pathSelected = false;
            Bus.instance().publish("reset", this, { ignoreMute: true });
        });
        spiderSelection.exit().remove();
        new Spider(spiderSelection, data.contextname).render();
    };
    Application.prototype.getToken = function () {
        return $('input[name=__RequestVerificationToken]').val();
    };
    Application.prototype.processData = function (err, data, update) {
        if (err) {
            Bus.instance().publish("data:error", err);
            d3.select("#viz").select("g").remove();
            return;
        }
        if (!data) {
            Bus.instance().publish("data:empty");
            d3.select("#viz").select("g").remove();
            return;
        }
        this.data = PathData.create(data);
        if (this.data) {
            var message = "data:loaded";
            if (update)
                message = "data:updated";
            Bus.instance().publish(message, this.data);
        }
    };
    Application.cctor = (function () {
        Bus.init();
        return null;
    })();
    return Application;
})();
var OutgoingNodes = (function () {
    function OutgoingNodes(el, nodes) {
        this.el = el;
        this.nodes = nodes;
        this.renderingPrevious = false;
        this.getNodesFunc = Path.getNextNodes;
        this.selector = ".nextNodes";
        this.fixedYPosition = 0;
        this.setupSubscribers();
    }
    OutgoingNodes.prototype.render = function () {
        var _this = this;
        var self = this;
        var nextNodeSelection = this.el.selectAll(this.selector).data(function (d) {
            if (State.instance().highLevelEntryEnabled())
                return _this.getNodesFunc(d).slice(0, 2);
            return _this.getNodesFunc(d);
        });
        nextNodeSelection.enter().call(function (d) {
            new OutgoingNode(d, self.nodes).render();
        });
    };
    OutgoingNodes.prototype.setupSubscribers = function () {
        var self = this;
        Bus.instance().subscribe("exit:mouseout", function () {
            self.reset();
        });
        Bus.instance().subscribe("mouseout", function () {
            self.reset();
        });
        Bus.instance().subscribe("exit:mouseover", function () {
            var DimColor = Settings.instance().DimColor;
            var SelectedColor = Settings.instance().SelectedColor;
            d3.selectAll("circle.previousNode").attr("stroke", null).attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + SelectedColor;
                }
            }).classed("selected", function () {
                return this.parentNode.__data__.isExit;
            }).classed("dimmed", function () {
                return !this.parentNode.__data__.isExit;
            });
            d3.selectAll("circle.nextNode").attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + DimColor;
                }
            }).classed("dimmed", true);
        });
        Bus.instance().subscribe("mouseover", function (node, data) {
            var DimColor = Settings.instance().DimColor;
            var SelectedColor = Settings.instance().SelectedColor;
            d3.selectAll("circle.node").attr("stroke", null).attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + DimColor;
                }
            }).classed("dimmed", true);
            d3.select(data.parent).selectAll("circle.previousNode").attr("style", function () {
                if (State.instance().highLevelEntryEnabled()) {
                    return "fill:" + SelectedColor;
                }
            }).classed("dimmed", false).classed("selected", true);
            if (node.next) {
                d3.select("#node" + node.id).attr("style", function () {
                    if (State.instance().highLevelEntryEnabled() || State.instance().highLevelExitEnabled()) {
                        return "fill:" + SelectedColor;
                    }
                }).classed("dimmed", false).classed("selected", true);
            }
            else {
                var pathGroup = d3.select(data.parent);
                pathGroup.selectAll("circle.nextNode").attr("style", function () {
                    if (State.instance().highLevelEntryEnabled() || State.instance().highLevelExitEnabled()) {
                        return "fill:" + SelectedColor;
                    }
                }).classed("dimmed", false).classed("selected", true);
            }
        });
    };
    OutgoingNodes.prototype.reset = function () {
        d3.selectAll("circle.node").classed("dimmed", false).classed("selected", false).classed("current", function (d) {
            return d.current;
        }).attr("style", function (d) {
            if (State.instance().highLevelEntryEnabled()) {
                return "fill:" + Settings.instance().NoDetailsColor;
            }
            if (d.next && State.instance().highLevelExitEnabled()) {
                return "fill:" + Scales.getInstance().getEffiencyColor(d.efficiency);
            }
        }).attr("stroke", function (d, i) {
            if (!d.current && State.instance().highLevelEntryEnabled()) {
                return Settings.instance().NoDetailsColor;
            }
            if (!d.current) {
                return Scales.getInstance().getEffiencyColor(d.efficiency);
            }
            return null;
        });
    };
    return OutgoingNodes;
})();
