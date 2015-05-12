/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
define(["require", "exports", "/-/speak/v1/pathanalyzer/scripts/app/application.js"], function(require, exports, App) {
    var Strings = (function () {
        function Strings() {
        }

        Strings.get = function (key) {
            var resources = App.StringResources.instance().stringResources;
            return resources.get(key) || key;
        };
        return Strings;
    })();
    exports.Strings = Strings;
});