define([
  "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (requestUtil) {
  var actionUrlLatestVersion = "/sitecore/shell/api/ct/ItemInfo/GetLatestVersionNumber";
  var actionUrlTestCandidateVersion = "/sitecore/shell/api/ct/ItemInfo/GetVersionTestCandidateVersionNumber";
  var actionUrlAddVersion = "/sitecore/shell/api/ct/ItemInfo/AddVersion";

  var getVersionRequest = function (id, url, callback) {
    var ajaxOptions = {
      cache: false,
      url: url + "?id=" + id,
      context: this,
      success: function(data) {
        callback(id, data.VersionNumber, data.Revision);
      }
    };

    requestUtil.performRequest(ajaxOptions);
  };

  return {
    getLatestVersionNumber: function(id, callback) {
      getVersionRequest(id, actionUrlLatestVersion, callback);
    },

    getTestCandidateVersionNumber: function(id, callback) {
      getVersionRequest(id, actionUrlTestCandidateVersion, callback);
    },

    addNewVersion: function (id, callback) {
      getVersionRequest(id, actionUrlAddVersion, callback);
    }
  }
});