define(["sitecore", "/-/speak/v1/pathanalyzer/spider.js"], function (Sitecore, spider) {
    var pathAnalyzer = Backbone.Model.extend({
        cookiePrefix: "scPathAnalyzer_",

        attributes: {
            "dateRange": null,
            "treeDefinition": null,
            "messageBar": null,
            "stringDictionary" : null
        },
        getTreeDefinition: function () {
            var treeDefinition = "",
                treeDefinitionFromUrl = this.getTreeDefinitionFromUrl(),
                treeDefinitionFromSession = this.getSessionValue("treeDefinition");

            if (treeDefinitionFromUrl) {
                treeDefinition = treeDefinitionFromUrl;
            } else if (treeDefinitionFromSession)
                treeDefinition = treeDefinitionFromSession;

            return treeDefinition;
        },

        setTreeDefinition: function (value) {
            value = value || "";
            this.setSessionValue("treeDefinition", value);

            this.updateUrl({
                treeDefinition: value
            });

            this.set("treeDefinition", value);
        },

        getTreeDefinitionFromUrl: function () {
            var hash = window.location.hash.substring(1),
              params = Sitecore.Helpers.url.getQueryParameters(hash);

            return params.treeDefinition;
        },

        reConvertDateFormat: function (date) {
            return $.datepicker.formatDate("yy-mm-dd", new Date(date));
        },

        updateDateRangeInSession: function (from, to) {
            if (from != null && this.validateDate(from))
                this.setSessionValue("fromDate", from);

            if (to != null && this.validateDate(to))
                this.setSessionValue("toDate", to);
        },

        updateDateRangeInUrl: function (from, to) {
            var hashObject = {
                dateFrom: from != null && this.validateDate(from) ? from : null,
                dateTo: to != null && this.validateDate(to) ? to : null
            };

            this.updateUrl(hashObject);
        },

        setDateRange: function (from, to) {
            this.updateDateRangeInSession(from, to);
            this.updateDateRangeInUrl(from, to);

            this.set("dateRange", {
                dateFrom: from,
                dateTo: to
            });
        },

        getDateRange: function () {
            var dateRangeFromUrl = this.getDateRangeFromUrl(),
                sessionFromDate = this.getSessionValue("fromDate"),
                sessionToDate = this.getSessionValue("toDate"),
                dateObject = null;

            if (dateRangeFromUrl.dateFrom && dateRangeFromUrl.dateTo) {
                if (this.validateDate(dateRangeFromUrl.dateFrom) && this.validateDate(dateRangeFromUrl.dateTo)) {
                    dateObject = dateRangeFromUrl;
                } else {
                    throw "Invalid date format";
                }
            } else if (sessionFromDate && sessionToDate) {
                dateObject = {
                    dateFrom: sessionFromDate,
                    dateTo: sessionToDate
                };
            }

            if (dateObject) {
                dateObject.dateFrom = this.reConvertDateFormat(dateObject.dateFrom);
                dateObject.dateTo = this.reConvertDateFormat(dateObject.dateTo);
            }

            return dateObject;
        },

        validateDate: function (dateString) {
            return dateString.match(/^\d{4}[\-]\d{2}[\-]\d{2}$/) || dateString.match(/^\d{2}[\-]\d{2}[\-]\d{4}$/);
        },

        getDateRangeFromUrl: function () {
            var hash = window.location.hash.substring(1),
              params = Sitecore.Helpers.url.getQueryParameters(hash);

            return {
                dateFrom: params.dateFrom,
                dateTo: params.dateTo
            };
        },

        updateUrl: function (hashObject) {
            var params = this.removeEmptyParams(window.location.hash.substring(1));
            params = params.replace(new RegExp("^&"), "");
            params = (params.length > 0) ? "?" + params : "";
            params = Sitecore.Helpers.url.addQueryParameters(params, hashObject).replace("?", "");

            window.location.hash = params;
        },

        removeEmptyParams: function (url) {
            var params = Sitecore.Helpers.url.getQueryParameters(url);

            for (var p in params) {
                if (params[p] === "")
                    url = url.replace(new RegExp("&?" + p + "="), "");
            }

            return url;
        },

        getSessionValue: function (name) {
            var cname = this.cookiePrefix + name,
              cookie = document.cookie,
              cookieArray = cookie.split(";");

            for (var i = 0; i < cookieArray.length; i++) {
                var cookieItem = cookieArray[i].trim().split("=");

                if (cookieItem[0] === cname) {
                    return cookieItem[1];
                }
            }

            return null;
        },

        setSessionValue: function (name, value) {
            document.cookie = this.cookiePrefix + name + "=" + value + ";path=/;";
        },

        showMessage: function (messageBar, type, message) {
            if (messageBar) {
                var errorObj = {
                    text: message,
                    actions: [],
                    closable: type !== "error"
                };

                messageBar.addMessage(type, errorObj);
            }
        },

        updateApp: function() {
            var treeDefinitionId = this.get("treeDefinition");

            if (treeDefinitionId == "" || treeDefinitionId == undefined) {
                var message = this.get("stringDictionary").get("Please choose a map");
                this.showMessage(this.get("messageBar"), "notification", message);
                return;
            }

            var dateRange = this.get("dateRange"),
                startDate = null,
                endDate = null;
            if (dateRange != null) {
                startDate = dateRange.dateFrom,
                endDate = dateRange.dateTo;
            }

            //need access to the "raw" silverlight DOM element, so go old skool javascript
            var pathAnalyzerApp = document.getElementById('scSilverlightPathExplorer');
            if (pathAnalyzerApp != null && pathAnalyzerApp.Content.PathAnalyzer != undefined) {
                pathAnalyzerApp.Content.PathAnalyzer.LoadTreeData(treeDefinitionId, startDate, endDate);
            }

            State.pathSelected = false;
            Bus.instance().publish("query:changed", { treeId: treeDefinitionId, startDate: startDate, endDate: endDate });
        }
    });

    return new pathAnalyzer;
});
