define(["/-/speak/v1/ecm/constants.js"], function (constants) {

    var urlService = function() {};
    urlService.prototype.getUrl = function(key, params) {
        var url = constants.URLs[key] || key,
        paramsString = params ? $.param(params) : null;
      return url + (paramsString ? "?" + paramsString : "");
    }

    return new urlService();
});