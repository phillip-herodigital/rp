require.config({
    paths: {
        d3: "/-/speak/v1/pathanalyzer/libs/d3.min"
    }
});

define(["sitecore", "d3"], function (Sitecore, d3) {
    var pathAnalyzer = Backbone.Model.extend({
        cookiePrefix: "scPathAnalyzer_",

        attributes: {
            "dateRange": null,
            "treeDefinition": null,
            "messageBar": null,
            "stringDictionary": null,
            "nodeGroupingOption": null,
            "pathSignificanceFilterValue": null
        },

        getDispatch: function () {
            return d3.dispatch('reset', 'pathover', 'pathout', 'exitover', 'exitout', 'pathclick', 'contextchanged', 'reload', 'dataload', 'dataloaded', 'dataready', 'baddata', 'nodata', 'filterchanged');
        },
        getTreeDefinition: function () {
            var treeDefinition = "",
                treeDefinitionFromUrl = this.getTreeDefinitionFromUrl(),
                treeDefinitionFromSession = this.getSessionValue("SelectedTreeDefinition");

            if (treeDefinitionFromUrl) {
                treeDefinition = treeDefinitionFromUrl;
            } else if (treeDefinitionFromSession)
                treeDefinition = treeDefinitionFromSession;

            return treeDefinition;
        },

        setTreeDefinition: function (value) {
            value = value || "";
            this.setSessionValue("SelectedTreeDefinition", value);

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

        updateDateRangeInSession: function (from, to) {
            if (from != null && this.validateDate(from))
                this.setSessionValue("SelectedStartDate", from);

            if (to != null && this.validateDate(to))
                this.setSessionValue("SelectedEndDate", to);
        },

        updateDateRangeInUrl: function (from, to) {
            var hashObject = {
                dateFrom: from != null && this.validateDate(from) ? from : null,
                dateTo: to != null && this.validateDate(to) ? to : null
            };

            this.updateUrl(hashObject);
        },

        setDateRange: function (from, to) {
            if (Sitecore.Helpers.date.isISO(from) && Sitecore.Helpers.date.isISO(to)) {
                var now = new Date();
                var timePart = "T" + this.ensureTwoDigits(now.getHours()) + this.ensureTwoDigits(now.getMinutes()) + this.ensureTwoDigits(now.getSeconds());

                var fromTime = from.slice(8);
                from = from.replace(fromTime, timePart);

                var toTime = to.slice(8);
                to = to.replace(toTime, timePart);
            }
            this.updateDateRangeInSession(from, to);
            this.updateDateRangeInUrl(from, to);

            this.set("dateRange", {
                dateFrom: from,
                dateTo: to
            });
        },

        getDateRangeFromUrl: function () {
            var hash = window.location.hash.substring(1),
              params = Sitecore.Helpers.url.getQueryParameters(hash);

            return {
                dateFrom: params.dateFrom,
                dateTo: params.dateTo
            };
        },

        getDateRange: function () {
            var dateRangeFromUrl = this.getDateRangeFromUrl(),
                sessionFromDate = this.getSessionValue("SelectedStartDate"),
                sessionToDate = this.getSessionValue("SelectedEndDate"),
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

            return dateObject;
        },

        getNodeGroupingOption: function () {
            var nodeGroupingOption = "",
                nodeGroupingOptionFromUrl = this.getNodeGroupingOptionFromUrl(),
                nodeGroupingOptionFromSession = this.getSessionValue("SelectedGroupingOption");

            if (nodeGroupingOptionFromUrl) {
                nodeGroupingOption = nodeGroupingOptionFromUrl;
            } else if (nodeGroupingOptionFromSession)
                nodeGroupingOption = nodeGroupingOptionFromSession;

            return nodeGroupingOption;
        },

        setNodeGroupingOption: function (value) {
            value = value || "";
            this.setSessionValue("SelectedGroupingOption", value);

            this.updateUrl({
                nodeGroupingOption: value
            });

            this.set("nodeGroupingOption", value);
        },

        getNodeGroupingOptionFromUrl: function () {
            var hash = window.location.hash.substring(1),
                params = Sitecore.Helpers.url.getQueryParameters(hash);

            return params.nodeGroupingOption;
        },

        getPathSignificanceFilterValue: function () {
            var pathSignificanceFilterValue = "",
                pathSignificanceFilterValueFromUrl = this.getPathSignificanceFilterValueFromUrl(),
                pathSignificanceFilterValueFromSession = this.getSessionValue("SelectedFilterOption");

            if (pathSignificanceFilterValueFromUrl) {
                pathSignificanceFilterValue = pathSignificanceFilterValueFromUrl;
            } else if (pathSignificanceFilterValueFromSession)
                pathSignificanceFilterValue = pathSignificanceFilterValueFromSession;

            return pathSignificanceFilterValue;
        },

        setPathSignificanceFilterValue: function (value) {
            value = value || "";
            this.setSessionValue("SelectedFilterOption", value);

            this.updateUrl({
                pathSignificanceFilterValue: value
            });

            this.set("pathSignificanceFilterValue", value);
        },

        getPathSignificanceFilterValueFromUrl: function () {
            var hash = window.location.hash.substring(1),
                params = Sitecore.Helpers.url.getQueryParameters(hash);

            return params.pathSignificanceFilterValue;
        },

        ensureTwoDigits: function (number) {
            return (number < 10) ? "0" + number.toString() : number.toString();
        },

        validateDate: function (dateString) {
            return Sitecore.Helpers.date.isISO(dateString) || dateString.match(/^\d{4}[\-]\d{2}[\-]\d{2}$/) || dateString.match(/^\d{2}[\-]\d{2}[\-]\d{4}$/);
        },

        formatDateForDisplay: function (date) {
            var utcDate = Sitecore.Helpers.date.parseISO(date);
            // workaround for timezone because $.datepicker.formatDate doesn't respect timezone
            if (utcDate) {
                var tzDate = new Date(utcDate * 1 + utcDate.getTimezoneOffset() * 60000);
                return $.datepicker.formatDate("yy-mm-dd", tzDate);
            }
            return null;
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
                var messageObj = {
                    text: message.text,
                    actions: [],
                    closable: type !== "error",
                    id: message.id
                };

                messageBar.addMessage(type, messageObj);
            }
        },

        updateApp: function () {
            var treeDefinitionId = this.get("treeDefinition");

            if (treeDefinitionId === "" || treeDefinitionId == undefined) {
                var message = this.get("stringDictionary").get("Please choose a map");
                this.showMessage(this.get("messageBar"), "notification", { text: message, id: "" });
                return;
            }

            var dateRange = this.get("dateRange"),
                startDate = null,
                endDate = null;
            if (dateRange != null) {
                startDate = dateRange.dateFrom,
                endDate = dateRange.dateTo;
            }

            var group = this.get("nodeGroupingOption");
            var pathfilter = this.get("pathSignificanceFilterValue");

            //need access to the "raw" silverlight DOM element, so go old skool javascript
            var pathAnalyzerApp = document.getElementById('scSilverlightPathExplorer');
            if (pathAnalyzerApp != null && pathAnalyzerApp.Content.PathAnalyzer != undefined) {
                pathAnalyzerApp.Content.PathAnalyzer.LoadTreeData(treeDefinitionId, startDate, endDate, group, pathfilter);
            }

            this.trigger("contextchanged", { treeDefinitionId: treeDefinitionId, startDate: startDate, endDate: endDate, group: group, pathfilter: pathfilter });
        }
    });

    return new pathAnalyzer;
});
