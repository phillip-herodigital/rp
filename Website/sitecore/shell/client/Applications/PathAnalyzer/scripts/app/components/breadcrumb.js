/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/resources.js"], function (require, exports, EventManager, Resources) {
    "use strict";

    var Breadcrumb = (function () {
        function Breadcrumb(el, w, h, id) {
            if (typeof id === "undefined") { id = "breadcrumb"; }
            this.el = el;
            this.w = w;
            this.h = h;
            this.id = id;
            this.bus = new EventManager.Bus();
            this.init();
        }
        Breadcrumb.prototype.render = function () {
        };

        Breadcrumb.prototype.init = function () {
            this.bus.subscribe("node:mouseover", function (node, data) {
                var breadcrumb = d3.select("#breadcrumb");
                var nodes = data.path.previous.slice(0);

                if (node.next) {
                    nodes.push(node);
                }

                if (breadcrumb && nodes) {
                    var bc = breadcrumb.select(".breadcrumb");
                    bc.selectAll("li").remove();
                    nodes.forEach(function (n) {
                        bc.append("li").classed("current", n.current).text(n.name);
                    });
                }
            });

            this.bus.subscribe("node:mouseout", function (node) {
                var breadcrumb = d3.select("#breadcrumb");

                if (breadcrumb) {
                    breadcrumb.select(".breadcrumb").selectAll("li").remove();
                    breadcrumb.select(".breadcrumb").append("li").text(Resources.Strings.get("Please select a path"));
                }
            });
        };
        return Breadcrumb;
    })();
    exports.Breadcrumb = Breadcrumb;
});
