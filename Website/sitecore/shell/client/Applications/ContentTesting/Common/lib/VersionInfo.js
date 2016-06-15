﻿define([
  "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (requestUtil) {
  var actionUrlLatestVersion = "/sitecore/shell/api/ct/ItemInfo/GetLatestVersionNumber";
  var actionUrlTestCandidateVersion = "/sitecore/shell/api/ct/ItemInfo/GetVersionTestCandidateVersionNumber";
  var actionUrlAddVersion = "/sitecore/shell/api/ct/ItemInfo/AddVersion";

  var getVersionRequest = function (id, url, callback) {
    var parsedId, parsedLanguage;

    if (_.isObject(id)) {
      parsedId = id.id;
      parsedLanguage = id.lang;
    }
    else {
      parsedId = id;
    }

    var ajaxOptions = {
      cache: false,
      url: _sc.Helpers.url.addQueryParameters(url, {id: parsedId, language: parsedLanguage || ""}),
      context: this,
      success: function (data) {
        if (data == null) {
          callback(parsedId, null, null, null);
        } else {
          callback(parsedId, data.VersionNumber, data.Revision, data.Language);
        }
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