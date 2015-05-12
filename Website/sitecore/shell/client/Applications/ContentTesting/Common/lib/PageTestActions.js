define([
  "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (requestUtil) {
  var actionUrlSave = "/sitecore/shell/api/ct/ContentTesting/SaveTest";
  var actionUrlStart = "/sitecore/shell/api/ct/ContentTesting/StartPageLevelTest";
  var actionUrlLoad = "/sitecore/shell/api/ct/ContentTesting/LoadTest";

  return {
    PageTestActions: function (options) {
      return {
        _messageBar: options.messageBar,
        _dictionary: options.dictionary,
        _progressIndicator: options.progressIndicator,
        _firstStartButton: options.firstStartButton,
        _bottomStartButton: options.bottomStartButton,
        _saveButton: options.saveButton,        

        savePageTest: function (options, suppressMessage, callback) {
          if (this._progressIndicator) {
            this._progressIndicator.set("isBusy", true);
          }

          // disabling of the button          
          if (this._saveButton)
            this._saveButton.set("isEnabled", false);

          var ajaxOptions = {
            type: "POST",
            url: actionUrlSave,
            context: this,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(options),
            success: function(data) {
              if (this._progressIndicator) {
                this._progressIndicator.set("isBusy", false);
              }

              // enabling button
              if (this._saveButton)
                this._saveButton.set("isEnabled", true);

              if (data) {
                if (!suppressMessage) {
                  this._messageBar.addMessage("notification", {
                    text: this._dictionary.get("Test saved successfully"),
                    actions: [],
                    closable: true
                  });
                }

                if (callback) {
                  callback();
                }
              } else {
                this._messageBar.addMessage("error", {
                  text: this._dictionary.get("An error occurred during save. Your test may not have been saved."),
                  actions: [],
                  closable: true
                });
              }
            },
            error: function(req, status, error) {
              if (this._progressIndicator) {
                this._progressIndicator.set("isBusy", false);
              }

              // enabling button
              if (this._saveButton)
                this._saveButton.set("isEnabled", true);

              this._messageBar.addMessage("error", {
                text: this._dictionary.get("An error occurred during save. Your test may not have been saved."),
                actions: [],
                closable: true
              });

              console.log("PageTestCommon Ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        startPageTest: function (options, callback) {
          if (this._progressIndicator) {
            this._progressIndicator.set("isBusy", true);
          }

          // disabling of the buttons          
          if (this._firstStartButton)
            this._firstStartButton.set("isEnabled", false);
          if (this._bottomStartButton)
            this._bottomStartButton.set("isEnabled", false);

          var ajaxOptions = {
            type: "POST",
            url: actionUrlStart,
            context: this,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(options),
            success: function(data) {
              if (this._progressIndicator) {
                this._progressIndicator.set("isBusy", false);
              }

              // enabling buttons
              if (this._firstStartButton)
                this._firstStartButton.set("isEnabled", true);
              if (this._bottomStartButton)
                this._bottomStartButton.set("isEnabled", true);

              if (data) {
                this._messageBar.addMessage("notification", {
                  text: this._dictionary.get("Test started"),
                  actions: [],
                  closable: true
                });

                if (callback) {
                  callback();
                }
              } else {
                this._messageBar.addMessage("error", {
                  text: this._dictionary.get("An error ocurred."),
                  actions: [],
                  closable: true
                });
              }
            },
            error: function(req, status, error) {
              if (this._progressIndicator) {
                this._progressIndicator.set("isBusy", false);
              }
              this._messageBar.addMessage("error", {
                text: this._dictionary.get("An error ocurred."),
                actions: [],
                closable: true
              });
              console.log("PageTestCommon Ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        loadPageTest: function (uri, callback) {
          if (this._progressIndicator) {
            this._progressIndicator.set("isBusy", true);
          }
          var ajaxOptions = {
            url: actionUrlLoad + "?itemUri=" + encodeURIComponent(uri),
            context: this,
            success: function(data) {
              if (this._progressIndicator) {
                this._progressIndicator.set("isBusy", false);
              }
              callback(data);
            },
            error: function(req, status, error) {
              if (this._progressIndicator) {
                this._progressIndicator.set("isBusy", false);
              }
              this._messageBar.addMessage("error", {
                text: this._dictionary.get("An error ocurred."),
                actions: [],
                closable: true
              });
              console.log("PageTestCommon Ajax call failed");
              console.log(status);
              console.log(error);
              console.log(req);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        }
      }
    }
  }
});