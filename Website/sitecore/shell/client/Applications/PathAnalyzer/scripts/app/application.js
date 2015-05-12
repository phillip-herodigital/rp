/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/requirejs/require.d.ts" />
define(["require",
        "exports",
        "/-/speak/v1/pathanalyzer/scripts/app/models.js",
        "/-/speak/v1/pathanalyzer/scripts/app/utils/helpers.js",
        "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js",
        "/-/speak/v1/pathanalyzer/scripts/app/components/tooltip.js",
        "/-/speak/v1/pathanalyzer/scripts/app/components/breadcrumb.js",
        "/-/speak/v1/pathanalyzer/scripts/app/components/filterBar.js",
        "/-/speak/v1/pathanalyzer/scripts/app/scales.js",
        "/-/speak/v1/pathanalyzer/scripts/app/components/spider.js",
        "/-/speak/v1/pathanalyzer/scripts/app/components/pageMetrics.js",
        "/-/speak/v1/pathanalyzer/scripts/app/utils/resources.js"],
        function (require, exports, Models, Helpers, EventManager, ToolTipComponent, BreadcrumbComponent, FilterBarComponent, Scales, SpiderComponent, PageMetricsComponent, Resources) {
            var App = (function () {
                function App(height, width, treeId, startDate, endDate, stubDataUri, stringDictionary) {
                    this.height = height;
                    this.width = width;
                    this.treeId = treeId;
                    this.startDate = startDate;
                    this.endDate = endDate;
                    this.stubDataUri = stubDataUri;
                    this.stringDictionary = stringDictionary;
                }
                App.prototype.initialize = function () {
                    this.init();
                    this.loadData();
                };

                App.prototype.setupSubscribers = function () {
                    var self = this;

                    this.bus.subscribe("data:loaded", function (data) {
                        Scales.getInstance().load(data);
                        d3.selectAll("#viz").call(self.render, { data: data, app: self });
                    });

                    this.bus.subscribe("data:updated", function (data) {
                        Scales.getInstance().load(data);
                        d3.selectAll("#viz").call(self.render, { data: data, app: self });
                    });

                    this.bus.subscribe("query:changed", function (args) {
                        self.treeId = args.treeId;
                        self.startDate = args.startDate;
                        self.endDate = args.endDate;
                        self.loadData(true);
                    });

                    this.bus.subscribe("stub:datasetchanged", function (args) {
                        self.datasetName = args;
                        self.loadData(true);
                    });

                    this.bus.subscribe("sort:changed", function (sort) {
                        AppState.pathSelected = false;
                    });
                };
                App.prototype.getToken = function () {
                    return $('input[name=__RequestVerificationToken]').val();
                },
                App.prototype.loadData = function (updated) {
                    if (typeof updated === "undefined") { updated = false; }
                    var self = this;

                    var itemId = Helpers.ArrayHelper.getParameterByName("id");
                    var serviceUri = "/sitecore/api/PathAnalyzer/Paths?treedefinitionid=" + this.treeId + "&itemid=" + itemId + "&start=" + this.startDate + "&end=" + this.endDate;

                    d3.json(serviceUri)
                        .header("X-RequestVerificationToken", self.getToken())
                        .header("X-Requested-With", "XMLHttpRequest")
                        .get(function (error, data) {
                            if (!data) {
                                return;
                            }
                            self.data = Models.PathData.create(data);
                            if (self.data) {
                                if (updated) {
                                    self.bus.publish("data:updated", self.data);
                                } else {
                                    self.bus.publish("data:loaded", self.data);
                                }
                            }
                        });
                };

                App.prototype.init = function () {
                    Settings.init(this.height, this.width);
                    AppState.init();
                    new StringResources(this.stringDictionary);

                    this.bus = new EventManager.Bus();
                    this.setupSubscribers();
                    this.datasetName = $('input[name=dataRadios]:checked', '#myForm').val();

                    var pageMetrics = new PageMetricsComponent.PageMetrics(d3.select("#pageMetrics"));
                    pageMetrics.render();

                    var tooltip = new ToolTipComponent.Tooltip(d3.select("body"));
                    tooltip.render();

                    var breadcrumb = new BreadcrumbComponent.Breadcrumb(d3.select("#breadcrumb"), this.width, this.height);
                    breadcrumb.render();

                    var filterBar = new FilterBarComponent.FilterBar(d3.select("#filterBar"), this.width, this.height);
                    filterBar.render();
                    var filter = filterBar.filter;

                    var colorSettings = new Scales(this.width, this.height);
                };

                App.prototype.render = function (viz, parameters) {
                    var data = parameters.data;
                    var app = parameters.app;

                    var spiderSelection = viz.selectAll("g").data([data]);

                    spiderSelection.enter().append("g").attr("id", "spider");

                    spiderSelection.append("rect").attr({ "class": "overlay", "width": app.width, "height": app.height }).on("click", function () {
                        if (app.bus) {
                            AppState.pathSelected = false;
                            app.bus.publish("reset", this, { ignoreMute: true });
                        }
                    });

                    spiderSelection.exit().remove();

                    var spider = new SpiderComponent.Spider(spiderSelection, app.width, app.height, data.contextname);
                    spider.render();
                };
                return App;
            })();
            exports.App = App;

            var StringResources = (function () {
                function StringResources(dictionary) {
                    this.stringResources = dictionary;

                    if (StringResources._instance === null) {
                        StringResources._instance = this;
                    }
                    return StringResources._instance;
                }

                StringResources.instance = function () {
                    return StringResources._instance;
                };
                StringResources._instance = null;
                return StringResources;
            })();
            exports.StringResources = StringResources;

            var Settings = (function () {
                function Settings() {
                    this.colorRange = ["#da3b1f", "#ec9d8d", "#90b67d", "#698e57"];
                    this.NoDetailsColor = "#969696";
                    this.DimColor = "#F7F7F7";
                    this.SelectedColor = "#3FAED9";
                    this.maxEntryPathWidth = 250;
                    this.minEntryPathWidth = 15;
                    this.minLineHeight = 3;
                    this.maxLineHeight = 15;
                    this.midPadding = 150;
                    this.leftPadding = 10;
                    this.topPadding = 50;
                }
                Settings.init = function (height, width) {
                    if (Settings._instance === null) {
                        Settings._instance = new Settings();
                        Settings._instance.width = width;
                        Settings._instance.height = height;
                    }
                };

                Settings.instance = function () {
                    return Settings._instance;
                };
                Settings._instance = null;
                return Settings;
            })();
            exports.Settings = Settings;

            var AppState = (function () {
                function AppState() {
                    this.bus = new EventManager.Bus();
                }
                AppState.init = function () {
                    if (AppState._instance === null) {
                        AppState._instance = new AppState();
                        AppState._instance.setupSubscribers();
                    }
                };

                AppState.prototype.setupSubscribers = function () {
                    var self = this;

                    this.bus.subscribe("data:loaded", function (data) {
                        self.updateCounts(data);
                    });

                    this.bus.subscribe("data:updated", function (data) {
                        self.updateCounts(data);
                    });

                    this.bus.subscribe("path:selected", function (node, data) {
                        AppState.pathSelected = true;
                    });
                };

                AppState.prototype.updateCounts = function (data) {
                    var nextNodes = d3.merge(data.paths.map(function (p) {
                        if (p.next)
                            return p.next;
                    }));
                    this.nextNodeCount = nextNodes.length;
                    this.prevPathCount = data.paths.length;
                };

                AppState.instance = function () {
                    return AppState._instance;
                };

                AppState.prototype.highLevelEntryEnabled = function () {
                    if (this.prevPathCount < 15) {
                        return false;
                    }
                    return Models.Filter.showingAll();
                };

                AppState.prototype.highLevelExitEnabled = function () {
                    if (this.nextNodeCount > 15) {
                        return true;
                    }
                    return this.highLevelEntryEnabled();
                };
                AppState._instance = null;
                return AppState;
            })();
            exports.AppState = AppState;
        });
