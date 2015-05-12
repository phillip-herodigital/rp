(function () {
  var dependencies = (typeof window !== "undefined") ? ["sitecore", "/-/speak/v1/listmanager/cookieParser.js"] : [null, "./cookieParser"];
  define(dependencies, function (sitecore, cookieParser) {
    var pageIndexKey = "pageIndex";

    return {
      cookieParser: cookieParser,
      getTargetControl: function (parameters) {
        var targetControlName = parameters.control;
        return this[targetControlName];
      },
      getSelectedItemId: function (parameters) {
        var targetControl = this.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          return targetControl.get("selectedItemId");
        }
        return "";
      },
      getSelectedItemType: function (parameters) {
        var targetControl = this.getTargetControl(parameters);
        if (typeof targetControl !== "undefined" && targetControl !== null) {
          var selectedItem = targetControl.get("selectedItem");
          if (selectedItem !== "") {
            return selectedItem.get("Type");
          }
        }

        return "";
      },
      showMoreCalled: function (parameters, callback) {
        var targetDataSourceName = parameters.entityDataSource,
        targetDataSource = this[targetDataSourceName];
        var pageIndex = targetDataSource.query.__parameters[pageIndexKey];
        pageIndex = new Number(pageIndex);
        pageIndex = pageIndex + 1;
        targetDataSource.query.__parameters[pageIndexKey] = pageIndex;
        var baseStructure = Array.prototype.filter.call(this.baseStructures, function (e) {
          return e.dataSource == targetDataSource;
        })[0];
        baseStructure.concatItems = true;
        callback(baseStructure, this);
      },
      callController: function (parameters, urlQuery, onSuccessCallback, onErrorCallback) {
        var actionData = this.extractActionData(parameters);
        var actionsDefaultUrl = actionData.url;
        var actionUrl = actionsDefaultUrl + urlQuery;
        var current = this;
        this.ajax({
          type: "POST",
          url: actionUrl,
          success: function (data) {
            onSuccessCallback(data, current);
          },
          error: function (jqXhr) {
            onErrorCallback(jqXhr.status, JSON.parse(jqXhr.responseText).Message);
          }
        });
      },
      ajax: function (call) {
        $.ajax(call);
      },
      extractActionData: function (parameters) {
        var targetDataSourceName = parameters.actionsDataSource,
          targetDataSource = this[targetDataSourceName];

        return {
          dataSource: targetDataSource,
          url: targetDataSource.get("url")
        };
      },
      showDefaultError: function (status, statusText, defaultText, messageContainer) {
        this.showError(status === 500 ? defaultText : statusText, messageContainer);
      },
      showError: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "error", 10000);
      },
      showWarning: function (text, messageContainer, timeout, keepPrevious) {
        this.showMessage(text, messageContainer, "warning", timeout, keepPrevious);
      },
      showNotification: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "notification", 10000);
      },
      showPinnedNotification: function (text, messageContainer) {
        this.showMessage(text, messageContainer, "notification", 0);
      },
      showMessage: function (text, messageContainer, messageType, timeout, keepPrevious) {
        if (!keepPrevious) {
          messageContainer.removeMessages("");
        }
        messageContainer.addMessage(messageType, {
          text: text,
          actions: [],
          closable: true,
          temporary: true
        });

        if (timeout > 0) {
          setTimeout(function () {
            messageContainer.removeMessages("");
          }, timeout);
        }
      },
      getIsConfirm: function (isConfirm) {
        if (typeof isConfirm === "undefined" || isConfirm === null) {
          isConfirm = true;
        }
        return isConfirm;
      },
      mergeListPages: function (parent, child) {
        var returnObject = {};
        for (var attr in parent) { returnObject[attr] = parent[attr]; }
        for (attr in child) { returnObject[attr] = child[attr]; }
        return returnObject;
      },
      defaultIfValueIsUndefinedOrNull: function (value, defaultValue) {
        if ((typeof value == "undefined") || (value == null)) {
          return defaultValue;
        }

        return value;
      },
      downloadFile: function (fileUrl, onErrorCallback) {
        var hiddenIFrameId = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameId);
        if (typeof iframe === "undefined" || iframe === null) {
          iframe = document.createElement('iframe');
          iframe.id = hiddenIFrameId;
          iframe.style.display = 'none';
          iframe.onload = $.proxy(function () { this.onLoadHandler(iframe, onErrorCallback); }, this);
          document.body.appendChild(iframe);
        }
        iframe.src = fileUrl;
      },
      onLoadHandler: function (iframe, onErrorCallback) {
        if (iframe.contentDocument.body.innerText !== "") {
          onErrorCallback(JSON.parse(iframe.contentDocument.body.innerText).Message);
        }
      },
      getLanguage: function () {
        return this.cookieParser.getCookieByName("shell#lang");
      },
      parseIsoDate: function(date) {
        return sitecore.Helpers.date.parseISO(date);
      }
    };
  });
})();