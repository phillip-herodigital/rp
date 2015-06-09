define(["sitecore",
        "/-/speak/v1/contenttesting/ImageThumbs.js",
        "/-/speak/v1/contenttesting/RequestUtil.js",
        "/-/speak/v1/contenttesting/TooltipCustom.js",
        "css!/-/speak/v1/contenttesting/CreateTestDialog.css"
], function (_sc, thumbsMod, requestUtil) {
  var TestWizard = _sc.Definitions.App.extend({

    // ListGoals - selecting "Trailing Value/Visit"
    trailingValueVisitGUID: '{00000000-0000-0000-0000-000000000000}',
    isTrailingValueVisitSet: false,

    _tooltipExpected: undefined,
    _tooltipStatistics: undefined,
    _imageThumbs: null,
    _showCompareScreenshot: false,
    _showAllScreenshots: false,

    srcCloseIcon: "/sitecore/shell/client/Speak/Assets/img/Speak/DialogWindow/close_button_sprite.png",

    initialized: function () {

      this.set("getThumbnailUrl", "/sitecore/shell/api/ct/TestThumbnails/GetThumbnail");
      this.detectBrowser();
      this.testOptions = new _sc.TestOptions();

      this.ItemInfoDataSource.set("itemUri", this.TestVariablesDataSource.get("itemuri"));

      // adding "img" elem to ".sc-smartpanel-close" link - for showing "small" close icon
      var $smartPanelElem = this.TestVariationsSmartPanel.viewModel.$el;
      var $smartPanelCloseLink = $smartPanelElem.find(".sc-smartpanel-close");
      $smartPanelCloseLink.append("<img src='" + this.srcCloseIcon + "' />");

      var screenshotSetting = this.SettingsDictionary.get("ContentTesting.GenerateScreenshots");
      this._showCompareScreenshot = screenshotSetting === "all" || screenshotSetting === "limited";
      this._showAllScreenshots = screenshotSetting === "all";

      this._imageThumbs = new thumbsMod.ImageThumbs({
        dictionary: this.StringDictionary
      });

      this.CarouselImage.set("isVisible", false);
      this.CompareImage.set("isVisible", false);

      this.TestVariablesDataSource.on("change:items", this.itemsUpdate, this);
      this.TestVariablesDataSource.on("change:items", this.validateTestLength, this);
      this.TestVariablesDataSource.on("change:multipleDevices", this.checkMultipleDevices, this);

      this.ItemInfoDataSource.on("change:hasActiveTest", this.checkActiveTest, this);

      // Subscribe to change of the "Maximum duration"
      if (this.MaximumSelect) {
        this.MaximumSelect.on("change:selectedItem", this.validateTestLength, this);
      }

      // Subscribe to change selected test variable in the list control
      this.TestVariablesStateListControl.on("change:selectedItemId", this.populateTestVariationsSmartPanel, this);

      // Subscribe to validation in StateListControl 
      this.TestVariablesStateListControl.on("validation:disableLastItem", this.validateDisabledTestVariables, this);
      this.TestVariationsStateListControl.on("validation:disableLastItem", this.validateDisabledTestVariations, this);

      this.TestVariationsStateListControl.on("change:disabledItems", this.setDisabledVariations, this);

      this.TestVariationsStateListControl.on("change:items", this.populateDisabledVariations, this);

      // Subscribe to events that trigger Preview changes
      this.TestVariablesDropDownListControl.on("change:selectedItem", this.setTestPreview, this);

      //this.ViewAllTestVariablesHyperlinkButton.on("click", this.setViewAllPreview, this);
      this.ViewAllTestVariablesHyperlinkButton.viewModel.$el.click({ self: this }, this.setViewAllPreview);

      // Update TestObjective UI according to selected test objective item
      if (this.ObjectiveList) {
        this.ObjectiveList.on("change:items", this.listGoalsItemsChanged, this);
        this.ObjectiveList.on("change:selectedItem", this.updateTestObjectiveUI, this);
      }

      // ExpectatedEffect tooltip
      this._tooltipExpected = new TooltipCustom();
      this._tooltipExpected.setTargetClick(this.ExpectationHelpIconButton.viewModel.$el,
        this.StringDictionary.get("Use the slider to predict how the test will effect the visitor engagement. Your prediction is used as an extra indicator for validation of the test result, and it has an effect on your performance report. You can use this to improve your optimization skill."));


      // Statistics tooltip
      if (this.StatisticsHelpIconButton) {
        this._tooltipStatistics = new TooltipCustom();
        this._tooltipStatistics.setTargetClick(this.StatisticsHelpIconButton.viewModel.$el,
          this.StringDictionary.get("Set the minimum confidence threshold the test needs to achieve before declaring the result statistical significant. High threshold will require a longer duration of the test."));
      }

      // Expectation
      this.ExpectationSlider.set("selectedValue", 0);

      //#5966 - updating CompareImage after show/hide PreviewAccordion
      //this.PreviewAccordion.on("change:isOpen", this.previewAccordionVisibleToggle, this);

      this.TestDurationDataSource.on("change:isEstimated", this.setNotEstimatedTextVisibility, this);

      this.TestDurationDataSource.on("change", this.validateTestLength, this);

      //subscribe to window click event in order to close DropDownButton popup
      this.TestVariablesDropDownButton.viewModel.$el.click(function (event) {
        event.stopPropagation();
      });

      this.BeforeAfterDropDownButton.viewModel.$el.click(function (event) {
        event.stopPropagation();
      });

      $(window).click(this, function (event) {
        var app = event.data;
        if (app.BeforeAfterDropDownButton.get("isOpen") === true || app.TestVariablesDropDownButton.get("isOpen") === true) {
          app.BeforeAfterDropDownButton.set("isOpen", false);
          app.TestVariablesDropDownButton.set("isOpen", false);
        }

        // #25956 - hiding of the SmartPanel by clicking outside
        if (app.TestVariationsSmartPanel && event.target) {
          var $targetElemInSmartPanel = app.TestVariationsSmartPanel.viewModel.$el.find(event.target);
          var $targetElemInStateListControl = app.TestVariablesStateListControl.viewModel.$el.find(event.target);
          // if "event.target" isn't lain in "TestVariationsSmartPanel", "TestVariablesStateListControl"
          if ($targetElemInSmartPanel.length === 0 && $targetElemInStateListControl.length === 0) {
            app.TestVariationsSmartPanel.set("isOpen", false);
          }
        }        

      });

      $(document).ready(this.CmsDialogFix);
      $(window).resize(this.CmsDialogFix);

      this.OptionsMapper.addOptionComponent(this.TrafficAllocationSlider, "selectedValue", "TrafficAllocation");
      this.OptionsMapper.addOptionComponent(this.ConfidenceLevelSelect, "selectedValue", "ConfidenceLevel");

      // Set default values for the controls
      this.setDefaults();

      this.setNotEstimatedTextVisibility();

      // Update text on variables tab
      this.TestDurationDataSource.on("change:variableCount change:variableCount change:valueCount change:experienceCount", this.updateTestMetricsText, this);
      this.updateTestMetricsText();

      this.TestDurationDataSource.on("change:viewsPerDay change:expectedDays", this.updateExpectedTimeWithEstimateText, this);
      this.OptionsMapper.on("change:TrafficAllocation change:ConfidenceLevel", this.updateExpectedTimeWithEstimateText, this);

      if (this.MaximumSelect) {
        this.MaximumSelect.on("change:selectedItem", this.updateExpectedTimeWithEstimateText, this);
      }

      this.updateExpectedTimeWithEstimateText();

      this.OptionsMapper.on("change:TrafficAllocation change:ConfidenceLevel", this.updateExpectedTimeWithoutEstimateText, this);
      this.updateExpectedTimeWithoutEstimateText();
    },

    CmsDialogFix: function () {
      $("[data-sc-id='TestWizardTabControl'] .tab-content").height($(window).height() - 200);
    },

    previewAccordionVisibleToggle: function () {
      //this.ImageList.viewModel.populateItems();
    },

    setDefaults: function () {

      if (this.TrafficAllocationSlider) {
        this.TrafficAllocationSlider.set("selectedValue", this.SettingsDictionary.get("ContentTesting.DefaultTrafficAllocation"));
      }

      // Composite may be missing due to security
      if (this.ConfidenceLevelSelect) {
        this.ConfidenceLevelSelect.on("change:items", function () {
          this.ConfidenceLevelSelect.set("selectedValue", this.SettingsDictionary.get("ContentTesting.DefaultConfidenceLevel"));
        }, this);
      }

      if (this.MinimumSelect) {
        this.MinimumSelect.on("change:items", this.setMinDurationDefaultValue, this);
      }

      if (this.MaximumSelect) {
        this.MaximumSelect.on("change:items", this.setMaxDurationDefaultValue, this);
      }
    },

    detectBrowser: function () {
      if (navigator.appName === 'Microsoft Internet Explorer') {
        $(document).find("body").addClass("ie");
      }
    },

    setNotEstimatedTextVisibility: function () {
      this.ExpectedTimeNotEstimateBorder.set("isVisible", !this.TestDurationDataSource.get("isEstimated"));
    },

    setMinDurationDefaultValue: function () {
      // Set the default minimum duration value from the config in the Minimum Duration combobox.
      var defaultMinDuration = this.SettingsDictionary.get("ContentTesting.MinimumDuration");
      if (this.MinimumSelect) {
        this.MinimumSelect.set("selectedValue", defaultMinDuration);
      }
    },

    setMaxDurationDefaultValue: function () {
      // Set the default maximum duration value from the config in the Maximum Duration combobox.
      var defaultMaxDuration = this.SettingsDictionary.get("ContentTesting.MaximumContentTestDuration");
      if (this.MaximumSelect) {
        var initialized = this.MaximumSelect.get("initialized");
        if (!initialized)
        {
          this.MaximumSelect.set("selectedValue", defaultMaxDuration);
        }
      }
    },

    listGoalsItemsChanged: function (sender) {
      if (!this.isTrailingValueVisitSet) {
        this.isTrailingValueVisitSet = true;
        this.ObjectiveList.set("selectedGuid", this.trailingValueVisitGUID);
      }
    },

    updateTestObjectiveUI: function (sender, selectedTestObjective) {
      if (typeof selectedTestObjective === 'undefined' || selectedTestObjective === null) {
        return;
      }

      if (selectedTestObjective.guid === this.trailingValueVisitGUID) {
        this.WinnerAutoSelect.set("isEnabled", true);
        this.WinnerAutoSelectUnless.set("isEnabled", false);
        this.WinnerManualSelect.set("isEnabled", true);
        this.WinnerAutoSelect.check();
      } else {
        this.WinnerAutoSelect.set("isEnabled", true);
        this.WinnerAutoSelectUnless.set("isEnabled", true);
        this.WinnerManualSelect.set("isEnabled", true);
        this.WinnerAutoSelectUnless.check();
      }
    },

    populateDisabledVariations: function () {
      var disabledVariations = this.testOptions.get("disabledVariations") || {};
      var testid = this.TestVariationsStateListControl.get("testId");

      if (disabledVariations[testid] !== undefined) {
        this.TestVariationsStateListControl.viewModel.populateDisabled(disabledVariations[testid]);
      }
    },

    setDisabledVariations: function () {
      var testid = this.TestVariationsStateListControl.get("testId");
      var disableditems = this.TestVariationsStateListControl.get("disabledItems");
      var variations = this.testOptions.get("disabledVariations") || {};

      variations[testid] = disableditems;
      this.testOptions.set("disabledVariations", variations);
    },

    populateTestVariationsSmartPanel: function () {
      // If selected test item is not empty than open the smart panel and request 
      // data source to return test variations y test id
      var selectedTestItem = this.TestVariablesStateListControl.get("selectedItem");
      if (selectedTestItem !== "") {
        console.log(selectedTestItem);
        this.TestVariationsSmartPanel.set("isOpen", true);
        var self = this;

        //TODO: ask for test variations for the listControl
        var uid = selectedTestItem.get("UId");
        this.TestVariationsDataSource.set("testid", uid);
        this.TestVariationsStateListControl.set("testId", uid);

        // Populate screenshot of first variant into smartpanel
        var items = this.TestCandidatesDataSource.get("items");

        for (var i in items) {
          var item = items[i];

          if (item.attrs.testId.toLowerCase() === "{" + uid + "}") {
            if (this._imageThumbs) {
              this._imageThumbs.populateImage(item, this.ThumbnailImageSrc.viewModel.$el, null, this.get("getThumbnailUrl"));
            }
            break;
          }
        }
      }
    },

    itemsUpdate: function (obj) {
      var items = this.TestVariablesDataSource.get("items");
      var itemCount = items.length;

      if (itemCount === 0) {
        this._disableDialog([this.NoCandidatesMessage]);
      }
      else {
        var isContentTesting = this.isJustContentTesting(items);

        // Identify testing type and display corresponding preview components
        this.displayPreviewContent(isContentTesting);

        // Update the default maximum duration value if MV test is configured from the configuration file.
        if (this.MaximumSelect) {
          if (!isContentTesting) {
            var defaultMVMaxDuration = this.SettingsDictionary.get("ContentTesting.MaximumOptimizationTestDuration");
            var items = this.MaximumSelect.get("items");
            if (items.length > 0) {
              this.MaximumSelect.set("selectedValue", defaultMVMaxDuration);
              this.MaximumSelect.set("initialized", true);
            }
            else {
              this.MaximumSelect.once("change:items", function () {
                this.MaximumSelect.set("selectedValue", defaultMVMaxDuration);
                this.MaximumSelect.set("initialized", true);
              }, this)
            }
          }
        }

        if (isContentTesting && this._showCompareScreenshot) {
          this.CompareImage.set("imageThumbs", this._imageThumbs);
          this.CompareImage.set("isVisible", true);
        }
        else if (this._showAllScreenshots) {
          this.CarouselImage.set("imageThumbs", this._imageThumbs);
          this.CarouselImage.set("isVisible", true);
        }

        if (!this.CompareImage.get("isVisible") && !this.CarouselImage.get("isVisible")) {
          this.PreviewAccordion.set("isVisible", false);
        }
        else {
          this.PreviewAccordion.set("isVisible", true);
        }

        this.TestCandidatesDataSource.set("itemUri", this.TestVariablesDataSource.get("itemuri"));
      }
    },

    displayPreviewContent: function (isContentTesting) {
      this.BeforeAfterDropDownButton.set("isVisible", isContentTesting);
      this.TestVariablesDropDownButton.set("isVisible", !isContentTesting);
    },

    isJustContentTesting: function (items) {
      if (items.length === 1 && items[0].TypeKey === 'Content') {
        return true;
      }

      return false;
    },

    //setViewAllPreview: function (event) {
    setViewAllPreview: function (event) {
      var self = event.data.self;
      // Set test variables dropdown button title
      self.TestVariablesDropDownButton.set('text', self.ViewAllTestVariablesHyperlinkButton.get('text'));

      // With no selected test nothing will be filtered (show all variants)
      self.CarouselImage.set("selectedTestId", null);
      self.CompareImage.set("selectedTestId", null);
    },

    okClicked: function () {
      this.StartTestButton.set("isEnabled", false);
      this.ServerProgressIndicator.set("isBusy", true);

      this.testOptions.set("itemUri", this.TestVariablesDataSource.get("itemuri"));

      this.testOptions.set("trackWithEngagementValue", true);
      this.testOptions.set("autoShowWinner", true);

      var showWinner = true;

      if (this.ConfidenceLevelSelect) {
        this.testOptions.set("confidenceLevel", this.ConfidenceLevelSelect.get("selectedValue"));
      }

      this.testOptions.set("trafficAllocation", this.OptionsMapper.get("TrafficAllocation"));

      if (this.ObjectiveList) {
        var goal = this.ObjectiveList.get("selectedItem");
        if (goal) {
          if (goal.guid !== '{00000000-0000-0000-0000-000000000000}') {
            this.testOptions.set("GoalId", goal.guid);
            this.testOptions.set("trackWithEngagementValue", false);
          }
        }
      }

      if (this.ExpectationSlider) {
        this.testOptions.set("Expectation", this.ExpectationSlider.get("selectedValue"));
      }

      if (this.MaximumSelect) {
        this.testOptions.set("MaxDuration", this.MaximumSelect.get("selectedValue"));
      }

      if (this.MinimumSelect) {
        this.testOptions.set("MinDuration", this.MinimumSelect.get("selectedValue"));
      }

      //rbAutoSelWinner
      //rbAutoSelWinnerBest
      //rbManualSelWinner

      if (this.get("groupTestObjective") !== undefined) {
        var groupValue = this.get("groupTestObjective");
        this.testOptions.set("SelectWinnerStrategy", groupValue);
      }

      var disabledItems = this.TestVariablesStateListControl.get("disabledItems");
      var disabled = [];

      for (var i in disabledItems) {
        disabled.push(disabledItems[i].UId);
      }

      this.testOptions.set("disabledVariants", disabled);

      var disabledVariationsList = [];

      var disabledVariations = this.testOptions.get("disabledVariations") || {};

      for (i in disabledVariations) {
        var variationsarray = [];
        for (var variation in disabledVariations[i]) {
          variationsarray.push(disabledVariations[i][variation].UId);
        }

        var d =
        {
          testid: i,
          variations: variationsarray
        };
        disabledVariationsList.push(d);
      }

      this.testOptions.set("disabledVariations", disabledVariationsList);

      var params = _sc.Helpers.url.getQueryParameters(window.location.href);
      this.testOptions.set("DeviceId", params.device);

      var self = this;
      var ajaxOptions = {
        type: "POST",
        url: "/sitecore/shell/api/ct/CreateTestDialog/StartTest",
        context: this,
        contentType: 'application/json; charset=UTF-8',
        data: this.testOptions.toJSONString(),
        success: function (data) {
          this.ServerProgressIndicator.set("isBusy", false);
          self.closeDialog("yes");
        },
        error: function (request, status, error) {
          alert("Request failed: " + status + " - " + error); // todo: skynet: translate text
        }
      };

      requestUtil.performRequest(ajaxOptions);
    },

    setTestPreview: function () {
      var selectedTest = this.TestVariablesDropDownListControl.get("selectedItem");

      if (selectedTest === '') {
        return;
      }

      // Set test variables dropdown button title
      this.TestVariablesDropDownButton.set('text', selectedTest.attributes.Name);

      // Filter images in the image list with the selected test
      // Set "selectedTestId" for "CompareImage" control
      var selectedTestId = selectedTest.attributes.UId;
      this.CarouselImage.set("selectedTestId", selectedTestId);
      this.CompareImage.set("selectedTestId", selectedTestId);
    },

    validateDisabledTestVariables: function () {
      // StringDictiory is use to translate texts into the context language
      this.VariablesTabMessageBar.addMessage('warning', this.StringDictionary.get(
          'You cannot disable this variable: it is the only one included in the test.'));
    },

    validateDisabledTestVariations: function () {
      //TODO: Think about a SPEAK dialog
      alert(this.StringDictionary.get(
          'You cannot disable this variation because the test needs at least two variations to be enabled.'));
    },

    validateTestLength: function () {
      if (!this.MaximumSelect) {
        return;
      }

      if (this.MaximumSelect.get("selectedItem") === null)
        return;

      var maxDurationValue = parseInt(this.MaximumSelect.get("selectedItem").Value, 10);
      if (_.isNaN(maxDurationValue))
        return;

      var isEstimated = this.TestDurationDataSource.get("isEstimated");
      var experiences = this.TestDurationDataSource.get("experienceCount");
      var daysExpected = this.TestDurationDataSource.get("expectedDays");
      var viewsPerDay = this.TestDurationDataSource.get("viewsPerDay");
      var requiredVisits = this.TestDurationDataSource.get("requiredVisits");

      var templateFirstMessage, templateSecondMessage, type;
      
      if (this.MinimumSelect) {
        var minDuration = parseInt(this.MinimumSelect.get("selectedValue"), 10);
        if (daysExpected < minDuration)
        {
          daysExpected = minDuration;
        }
      }

      this.PreviewTabMessageBar.viewModel.$el.css("display", "block");
      this.PreviewTabMessageBar.removeMessages();

      if (!isEstimated) { // If not enough traffic to do forecasting
        type = 'notification';

        templateFirstMessage = _.template(
          this.StringDictionary.get("With the changes you have made, you have created <%= experiences %> experiences.") + " " +
          this.StringDictionary.get("The test will require <%= requiredVisits %> visitors to find a winner.") + " " +
          this.StringDictionary.get("We do not have enough historical data to provide a forecasting on duration."));

        this.PreviewTabMessageBar.addMessage(
          type,
          templateFirstMessage({ experiences: experiences, requiredVisits: requiredVisits }));
      }
      else {
        if (daysExpected > maxDurationValue) { // If test will take too long
          type = "warning";

          templateFirstMessage = _.template(
            this.StringDictionary.get("You have now created <%= experiences %> experiences.") + " " +
            this.StringDictionary.get("Historical data shows it will take more than <%= days %> days to finish the test.") + " " +
            this.StringDictionary.get("You can reduce this number by disabling some of the variables, or by adjusting the test settings.")
          );

          templateSecondMessage = _.template(
           this.StringDictionary.get("This page has <%= viewsPerDay %> visitors per day on average.") + " " +
           this.StringDictionary.get("The test is expected to need <%= days %> days to reach a statistically significant result.") + " " +
           this.StringDictionary.get("Then it is possible to determine which experience contributes the most to the engagement value.") + " " +
           this.StringDictionary.get("You can manually stop the test by picking a winner before the test ends automatically."));
        } else {
          type = "notification";

          templateFirstMessage = _.template(
            this.StringDictionary.get("You have now created <%= experiences %> experiences.") + " " +
            this.StringDictionary.get("Historical data shows that it will take about <%= days %> days to finish the test."));

          templateSecondMessage = _.template(
           this.StringDictionary.get("This page has <%= viewsPerDay %> visitors per day on average.") + " " +
           this.StringDictionary.get("The test is expected to need <%= days %> days to reach a statistically significant result.") + " " +
           this.StringDictionary.get("Then it is possible to determine which experience contributes the most to the engagement value."));
        }

        this.PreviewTabMessageBar.addMessage(
          type,
          templateFirstMessage({ experiences: experiences, days: daysExpected }));

        this.PreviewTabMessageBar.addMessage(
          type,
          templateSecondMessage({ viewsPerDay: viewsPerDay, days: daysExpected }));
      }
    },

    updateTestMetricsText: function () {
      var templateTextKey = this.TestDurationDataSource.get("variableCount") === 1 ?
        "The <%= variableCount %> variable has <%= valueCount %> variations, which together create <%= experienceCount %> experiences." :
        "The <%= variableCount %> variables have combined <%= valueCount %> variations, which together create <%= experienceCount %> experiences.";

      var template = _.template(this.VariablesStringDictionary.get(templateTextKey));
      this.TestMetricsText.set("text", template({
        variableCount: this.TestDurationDataSource.get("variableCount"),
        valueCount: this.TestDurationDataSource.get("valueCount"),
        experienceCount: this.TestDurationDataSource.get("experienceCount")
      }));
    },

    updateExpectedTimeWithEstimateText: function () {
      var maxSelectedItem;
      if (this.MaximumSelect) {
        maxSelectedItem = this.MaximumSelect.get("selectedItem");
      }

      var parsedMaxSelectedValue = maxSelectedItem ? parseInt(maxSelectedItem.Value, 10) : 0;
      var expectedDays = this.TestDurationDataSource.get("expectedDays");
      
      if (this.MinimumSelect) {
        var minDuration = parseInt(this.MinimumSelect.get("selectedValue"), 10);
        if (expectedDays < minDuration)
        {
          expectedDays = minDuration;
        }
      }

      var template, color;

      if (expectedDays > parsedMaxSelectedValue) {
        template = _.template(this.VariablesStringDictionary.get("Based on historical data this page has <%= dailyVisists %> visitors per day, with a traffic allocation of <%= trafficAllocation %>% and a confidence level of <%= confidenceLevel %>% the test is expected to last <%= duration %> days, and the maximum duration of the test is <%= maximumDuration %> days."));
        color = "#DC291E";
      } else {
        template = _.template(this.VariablesStringDictionary.get("Based on historical data this page has <%= dailyVisists %> visitors per day, with a traffic allocation of <%= trafficAllocation %>% and a confidence level of <%= confidenceLevel %>% the test is expected to last <%= duration %> days."));
        color = "";
      }

      this.ExpectedTimeWithEstimate.set("text", template({
        dailyVisists: this.TestDurationDataSource.get("viewsPerDay"),
        trafficAllocation: this.OptionsMapper.get("TrafficAllocation"),
        confidenceLevel: this.OptionsMapper.get("ConfidenceLevel"),
        duration: expectedDays,
        maximumDuration: parsedMaxSelectedValue
      }));

      this.ExpectedTimeWithEstimate.viewModel.$el.css("color", color);
    },

    updateExpectedTimeWithoutEstimateText: function () {
      var template = _.template(this.VariablesStringDictionary.get("The traffic allocation is set to <%= trafficAllocation %>% and the confidence level is <%= confidenceLevel %>%. There is not enough historical data to forecast duration."));
      this.ExpectedTimeWithoutEstimate.set("text", template({
        trafficAllocation: this.OptionsMapper.get("TrafficAllocation"),
        confidenceLevel: this.OptionsMapper.get("ConfidenceLevel"),
      }));
    },

    checkMultipleDevices: function () {
      if(this.TestVariablesDataSource.get("multipleDevices")) {
        this._disableDialog([this.MultipleDevicesMessage]);
      }
    },

    checkActiveTest: function() {
      if (this.ItemInfoDataSource.get("hasActiveTest")) {
        this._disableDialog([this.ContainsActiveTestMessage]);
      }
    },

    _disableDialog: function (allowedComponents) {
      this.TestWizardTabControl.set("isVisible", false);
      this.EndWizardButton.set("isVisible", false);
      this.StartTestButton.set("isVisible", false);

      if (allowedComponents) {
        _.each(allowedComponents, function (component) {
          component.set("isVisible", true);
        });
      }
    }
  });

  return TestWizard;
});