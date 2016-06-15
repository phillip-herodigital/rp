define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js"], function (Sitecore, pathAnalyzer) {
    Sitecore.Factories.createBaseComponent({
        name: "MapSelector",
        base: "ControlBase",
        selector: ".sc-MapSelector",
        attributes: [
        ],

        events: {

        },

        initialize: function () {
            var renderingId = this.model.get("name"),
                dateRangeFilter = this.app[renderingId + "DateRangeFilter"],
                treeDefinitionFilter = this.app[renderingId + "TreeDefinitionFilter"],
                nodeGroupingOptions = this.app["NodeGroupingOptions"],
                pathSignificanceFilter = this.app["PathSignificanceFilter"],
                filterToggleButton = this.app[renderingId + "FilterToggleButton"],
                submitButton = this.app[renderingId + "SubmitButton"],
                thisModel = this.model;

            pathAnalyzer.on("change:dateRange", function (m, dateRange) {
                dateRangeFilter.set("fromDate", dateRange.dateFrom);
                dateRangeFilter.set("toDate", dateRange.dateTo);
                thisModel.viewModel.setSelectedText();
            });

            pathAnalyzer.on("change:treeDefinition", function (model, value) {
                treeDefinitionFilter.set("selectedTreeDefinitionValue", value);
                thisModel.viewModel.setSelectedText();
            });

            pathAnalyzer.set("messageBar", this.app.DashboardMessageBar);
            pathAnalyzer.set("stringDictionary", this.app.StringDictionaryDomain);

            submitButton.on("click", function () {
                dateRangeFilter.viewModel.setGlobalDateRange();
                treeDefinitionFilter.viewModel.setSelectedTreeDefinition(null);
                if (typeof nodeGroupingOptions !== "undefined") {
                  nodeGroupingOptions.viewModel.setSelectedOption();
                }
                if (typeof pathSignificanceFilter !== "undefined") {
                  pathSignificanceFilter.viewModel.setSelectedValue();
                }
                thisModel.viewModel.setSelectedText();
                pathAnalyzer.updateApp();
                filterToggleButton.viewModel.close();
            }, this);
        },

        setSelectedText:function() {
            var renderingId = this.model.get("name"),
              treeDefinitionFilter = this.app[renderingId + "TreeDefinitionFilter"],
              filterToggleButton = this.app[renderingId + "FilterToggleButton"],
              stringDictionary = this.app.StringDictionaryDomain

            var text = treeDefinitionFilter.get("selectedTreeDefinitionName");
            if (text === null) {
              text = stringDictionary.get("PleaseSelectMap");
            }
            var dateRange = pathAnalyzer.get("dateRange");
            if (dateRange) {
                var dateFrom = dateRange.dateFrom != null ? pathAnalyzer.formatDateForDisplay(dateRange.dateFrom) : "";
                var dateTo = dateRange.dateTo != null ? pathAnalyzer.formatDateForDisplay(dateRange.dateTo) : stringDictionary.get("Present");
                text += " | " + dateFrom + " " + stringDictionary.get("to") + " " + dateTo;
            }

            filterToggleButton.set("text", text);
        },

        bindComponentVisibility: function (button, component) {
            button.on("change:isOpen", function () {
                component.set("isVisible", this.get("isOpen"));
            });
        },

        close: function () {
          var renderingId = this.model.get("name"),
              filterToggleButton = this.app[renderingId + "FilterToggleButton"];

          filterToggleButton.close();
        }
    });
});
