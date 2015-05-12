/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function (require, exports, App) {
    var EntryPathGenerator = (function () {
        function EntryPathGenerator(w, h) {
            this.w = w;
            this.h = h;
            if (EntryPathGenerator._instance === null) {
                this.topPadding = App.Settings.instance().topPadding;
                this.midPadding = App.Settings.instance().midPadding;
                this.leftPadding = App.Settings.instance().leftPadding;
                EntryPathGenerator._instance = this;
            }
            return EntryPathGenerator._instance;
        }
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
            return [
                { "x": x, "y": y },
                { "x": this.w / 2 - this.midPadding, "y": y },
                { "x": this.w / 2, "y": this.h / 2 }];
        };

        EntryPathGenerator.prototype.getLine = function (y) {
            return [
                { "x": this.leftPadding, "y": y },
                { "x": this.w / 2 - this.midPadding, "y": y },
                { "x": this.w / 2, "y": this.h / 2 }];
        };

        EntryPathGenerator.prototype.getExitLine = function (y) {
            return [
                { "x": this.w / 2, "y": this.h / 2 },
                { "x": this.w / 2 + this.midPadding, "y": y },
                { "x": this.w - this.midPadding, "y": y }];
        };
        EntryPathGenerator._instance = null;
        return EntryPathGenerator;
    })();
    exports.EntryPathGenerator = EntryPathGenerator;

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
    exports.ArrayHelper = ArrayHelper;
});
