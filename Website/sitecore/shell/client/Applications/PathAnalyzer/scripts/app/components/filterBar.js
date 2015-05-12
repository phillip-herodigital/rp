/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/models.js", "/-/speak/v1/pathanalyzer/scripts/app/utils/eventManager.js"], function(require, exports, Models, EventManager) {
    "use strict";

    var FilterBar = (function () {
        function FilterBar(el, w, h, id) {
            if (typeof id === "undefined") { id = "filterBar"; }
            this.el = el;
            this.w = w;
            this.h = h;
            this.id = id;
            this.bus = new EventManager.Bus();
            // TODO: replace hardcode
            this.filter = new Models.Filter("visits", true, 10);
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

                self.bus.publish("reset", this, { ignoreMute: true });
            });

            this.el.selectAll("input.sort").on("change", function () {
                self.filter.sortBy = this.value;
                self.bus.publish("sort:changed", this, { ignoreMute: true });
            });
        };
        return FilterBar;
    })();
    exports.FilterBar = FilterBar;
});
