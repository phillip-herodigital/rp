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
                filterToggleButton = this.app[renderingId + "FilterToggleButton"],
                submitButton = this.app[renderingId + "SubmitButton"],
                submitButtonWrapper = this.app[renderingId + "ButtonWrapper"],
                thisModel = this.model;

            //this.bindComponentVisibility(filterToggleButton, treeDefinitionFilter);
            //this.bindComponentVisibility(filterToggleButton, dateRangeFilter);
            //this.bindComponentVisibility(filterToggleButton, submitButtonWrapper);
            //filterToggleButton.viewModel.open();

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
                thisModel.viewModel.setSelectedText();
                pathAnalyzer.updateApp();
                filterToggleButton.viewModel.close();
            }, this);
        },

        setSelectedText:function() {
            var renderingId = this.model.get("name"),
                treeDefinitionFilter = this.app[renderingId + "TreeDefinitionFilter"],
                filterToggleButton = this.app[renderingId + "FilterToggleButton"],
                stringDictionary = this.app.StringDictionaryDomain;

            var text = treeDefinitionFilter.get("selectedTreeDefinitionName");
            var dateRange = pathAnalyzer.get("dateRange");
            if (dateRange) {
                var dateFrom = dateRange.dateFrom != null ? dateRange.dateFrom : "";
                var dateTo = dateRange.dateTo != null ? dateRange.dateTo : stringDictionary.get("Present");
                text += " | " + dateFrom + " to " + dateTo;
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
