define([
  "sitecore",
  "/-/speak/v1/contenttesting/BindingUtil.js",
  "/-/speak/v1/contenttesting/SelectPagesToTest.js",
  "/-/speak/v1/contenttesting/SelectItemDialog.js",
  "/-/speak/v1/contenttesting/ReviewTest.js",
  "/-/speak/v1/contenttesting/ImageThumbs.js",
  "/-/speak/v1/contenttesting/VersionInfo.js",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/PageTestActions.js",
  "/-/speak/v1/contenttesting/ModeFix.js",
  "/-/speak/v1/contenttesting/TooltipCustom.js"
], function (_sc, bindingUtil, selectPagesToTestMod, selectItemDialogMod, reviewTestMod, thumbsMod, versionInfoMod, dataUtilMod, pageTestActionsMod, modeFix) {
  var PageTest = _sc.Definitions.App.extend({
    _tooltipExpected: undefined,
    _tooltipStatistics: undefined,
    _testItemUriProperty: "testItemUri",
    _testItemTemplateIdProperty: "testItemTemplateId",
    savedOptions: null,
    invalidated: false,
    _forceLoad: false,
    showThumbnails: true,

    // ListGoals - selecting "Trailing Value/Visit"
    trailingValueVisitGUID: '{00000000-0000-0000-0000-000000000000}',
    isTrailingValueVisitSet: false,

    initialized: function () {
      // workaround
      modeFix.fixModeCookies();

      var self = this;

      var screenshotSetting = this.Settings.get("ContentTesting.GenerateScreenshots");
      this.showThumbnails = screenshotSetting == "all" || screenshotSetting == "limited";

      this.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, { source: this, sourceProp: this._testItemUriProperty, target: this.ItemInfoDataSource, targetProp: "itemUri" });
      this.ItemInfoDataSource.on("change:status", this.testStatusChanged, { self: this });
      this.on("change:" + this._testItemUriProperty + " change:" + selectPagesToTestMod.testItemsProperty, function () { self.invalidated = true; });

      this.actions = new pageTestActionsMod.PageTestActions({
        messageBar: this.PageMessageBar,
        dictionary: this.Texts,
        progressIndicator: this.AppProgressIndicator,
        firstStartButton: this.FirstStartButton,
        bottomStartButton: this.BottomStartButton,
        saveButton: this.SaveButton,        
      });

      this.initPagesTab();
      this.initReviewTab();
      this.initReportTab();

      this.SummaryRepeater.on("subAppLoaded", this.bindSummaryEntry, this);
      this.bindSummaryData();

      // Ensure carousel redraws when visible so elastislider can work out it's dimensions
      this.Tabs.on("change:selectedTab", this.CarouselImage.viewModel.populateCarousel, this);

      // ExpectatedEffect tooltip
      this._tooltipExpected = new TooltipCustom();
      this._tooltipExpected.setTargetClick(this.ExpectationHelpIconButton.viewModel.$el,
        self.Texts.get("Use the slider to predict how the test will effect the visitor engagement. Your prediction is used as an extra indicator for validation of the test result, and it has an effect on your performance report. You can use this to improve your optimization skill."));

      // Statistics tooltip
      if (this.StatisticsHelpIconButton) {
        this._tooltipStatistics = new TooltipCustom();
        this._tooltipStatistics.setTargetClick(this.StatisticsHelpIconButton.viewModel.$el,
          self.Texts.get("Set the minimum confidence threshold the test needs to achieve before declaring the result statistical significant. High threshold will require a longer duration of the test."));
      }

      var closeCheck = function () {
        if (!self.invalidated) {
          return;
        }

        var current = self.createTestOptions();
        if (!_.isEqual(self.savedOptions, current)) {
          return self.Texts.get("The test has not been saved");
        }
      };

      // bind both beforeunload and unload as beforeunload is proprietry
      $(window).on("beforeunload", closeCheck);
      $(window).unload(closeCheck);
      
      var params = _sc.Helpers.url.getQueryParameters(window.location.href);
      var showReport = (params.report == "true");
      var forceLoad = (params.load == "true");
      this._forceLoad = showReport || forceLoad;
      var qsPage = params.page;
      var qsLanguage = params.language;
      if (qsPage) {
        this.set("selectedItemId", qsPage);
        this.set("selectedLanguage", qsLanguage);
        this.selectTestPage();
      }
      else {
        this.SelectPageWindow.show();
      }

      if (showReport) {
        this.showLastReport();
      }

      // Update TestObjective UI according to selected test objective item
      if (this.ObjectiveList !== undefined) {
        this.ObjectiveList.on("change:items", this.listGoalsItemsChanged, this);
        this.ObjectiveList.on("change:selectedItem", this.updateTestObjectiveUI, this);
      }


      this.TestDefinitionDataSource.on("change:conversions", this.handleTestObjectives, this);
    },

    initPagesTab: function () {
      this.on("change:" + this._testItemUriProperty, bindingUtil.bindVisibility, { source: this, sourceProp: this._testItemUriProperty, target: this.PagesBorder });
      this.on("change:" + this._testItemUriProperty, bindingUtil.bindVisibility, { source: this, sourceProp: this._testItemUriProperty, target: this.SelectPageBorder, hide: true });


      var selectItemDialog = new selectItemDialogMod.SelectItemDialog({
        host: this,
        itemIdPropertyName: "selectedItemId",
        itemTemplateIdPropertyName: "selectedTemplateId",
        dialogWindow: this.SelectPageWindow
      });

      this.selectPagesToTest = new selectPagesToTestMod.SelectPagesToTest({
        testItemDataSource: this.ItemInfoDataSource,
        hostPage: this,
        testItemUriProperty: this._testItemUriProperty,
        testItemTemplateProperty: this._testItemTemplateIdProperty,
        compareTemplates : true,
        selectItemDialog: selectItemDialog
      });

      if (!this.showThumbnails) {
        this.ThumbnailBorder.set("isVisible", false);
        this.ThumbnailProgressIndicator.set("isVisible", false);
      }
    },

    initReviewTab: function () {
      this.reviewTest = new reviewTestMod.ReviewTest({
        hostPage: this,
        testItemsProperty: selectPagesToTestMod.testItemsProperty,
        testItemUriProperty: this._testItemUriProperty
      });

      if (this.showThumbnails) {
        this.CarouselImage.set("imageThumbs", new thumbsMod.ImageThumbs({
          dictionary: this.Texts
        }));
      }
      else {
        this.PreviewAccordion.set("isVisible", false);
      }
    },

    initReportTab: function () {
      var self = this;

      this.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, {
        source: this,
        sourceProp: this._testItemUriProperty,
        target: this.TestDefinitionDataSource,
        targetProp: function (ob, value) {
          var uri = new dataUtilMod.DataUri(value);
          ob.set({
            "itemId": uri.id,
            "version": self.ItemInfoDataSource.get("lastTestVersion") || uri.ver
          });
        }
      });

      this.ConversionRateIndicator.on("change:selectedItem", this.setSelectedExperience, { control: this.ConversionRateIndicator, app: this });
      this.EngagementValueIndicator.on("change:selectedItem", this.setSelectedExperience, { control: this.EngagementValueIndicator, app: this });
      this.on("change:selectedExperience", this.notifyExperienceChange, { app: this });
    },

    selectTestPage: function () {
      var itemId = this.get("selectedItemId");
      var language = this.get("selectedLanguage");
      var itemTempateId = this.get("selectedTemplateId");
      if (!itemId || itemId.length === 0) {
        alert(this.Texts.get("You must select a page to test"));
        return;
      }

      var self = this;
      versionInfoMod.getLatestVersionNumber({ id: itemId, language: language }, function (id, version, revision, language) {
        var uri = new dataUtilMod.DataUri();
        uri.id = id;
        uri.ver = version;
        uri.rev = revision;
        uri.lang = language;

        self.set(self._testItemUriProperty, uri.toString());
        self.set(self._testItemTemplateIdProperty, itemTempateId);
        self.SelectPageWindow.hide();
      });
    },

    bindSummaryData: function () {
      this.SummaryRepeater.viewModel.reset();
      this.SummaryRepeater.viewModel.addData([
        {
          Name: this.Texts.get("Page"),
          ValueRef: this.ItemInfoDataSource,
          ValueProp: "name"
        },
        {
          Name: this.Texts.get("Status"),
          ValueRef: this.ItemInfoDataSource,
          ValueProp: "status"
        },
        {
          Name: this.Texts.get("Created date"),
          ValueRef: this.ItemInfoDataSource,
          ValueProp: "testCreatedShort"
        },
        {
          Name: this.Texts.get("Created by"),
          ValueRef: this.ItemInfoDataSource,
          ValueProp: "testCreatedBy"
        }
      ]);

      if (this.TestDurationDataSource) {
        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Expected time"),
            ValueRef: this.TestDurationDataSource,
            ValueProp: "expectedDays",
            VisibleProp: "expectedDays",
            VisibleInv: false,
            Postfix: " " + this.Texts.get("days")
          }
        ]);
        
        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Expected time"),
            ValueRef: this.TestDurationDataSource,
            ValueProp: "requiredVisits",
            VisibleProp: "expectedDays",
            VisibleInv: true,
            Postfix: " " + this.Texts.get("visitors")
          }
        ]);
      }

      if (this.TrafficAllocationSlider) {
        var trafficAllocationText = this.Texts.get("Traffic allocation is set to") + " ";
        this.TrafficAllocationLabel.set("text", trafficAllocationText + this.TrafficAllocationSlider.get("selectedValue") + "%");
        this.TrafficAllocationSlider.on("change:selectedValue", function (obj) {
          this.TrafficAllocationLabel.set("text", trafficAllocationText + this.TrafficAllocationSlider.get("selectedValue") + "%");
        }, this);

        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Traffic allocation"),
            ValueRef: this.TrafficAllocationSlider,
            ValueProp: "selectedValue",
            Postfix: "%"
          }
        ]);
      }

      if (this.ConfidenceLevelSelect) {
        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Confidence level"),
            ValueRef: this.ConfidenceLevelSelect,
            ValueProp: "selectedValue",
            Postfix: "%"
          }
        ]);
      }

      if (this.ObjectiveList) {
        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Test objective"),
            ValueRef: this.ObjectiveList,
            ValueProp: "selectedName"
          }
        ]);
      }

      if (this.MaximumSelect) {
        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Maximum duration"),
            ValueRef: this.MaximumSelect,
            ValueProp: "selectedValue",
            Postfix: " " + this.Texts.get("days")
          }
        ]);
      }

      if (this.MinimumSelect) {
        this.SummaryRepeater.viewModel.addData([
          {
            Name: this.Texts.get("Minimum duration"),
            ValueRef: this.MinimumSelect,
            ValueProp: "selectedValue",
            Postfix: " " + this.Texts.get("days")
          }
        ]);
      }
    },

    bindSummaryEntry: function (args) {
      var subapp = args.app;
      var data = args.data;

      subapp.Name.set("text", data.Name);

      if (data.ValueRef) {
        
        data.ValueRef.on("change:" + data.ValueProp, bindingUtil.propagateChange, {
          target: subapp.Value,
          targetProp: "text",
          source: data.ValueRef,
          sourceProp: data.ValueProp,
          postfix: data.Postfix
        });

        var value = data.ValueRef.get(data.ValueProp);
        if (value === null || value === undefined) {
          value = "--";
        }
        else {
          value += (data.Postfix || "");
        }

        subapp.Value.set("text", value);

        if (data.VisibleProp) {
          data.ValueRef.on("change:" + data.VisibleProp, bindingUtil.bindVisibility, {
            source: data.ValueRef,
            sourceProp: data.VisibleProp,
            hide: data.VisibleInv,
            target: subapp.Entry
          });

          if (data.VisibleInv) {
            subapp.Entry.set("isVisible", false);
          }
        }
      } else {
        subapp.Value.set("text", data.Value + (data.Postfix || ""));
      }
    },

    addPageOptionSelect: function(){
      this.selectPagesToTest.addPageOptionSelect();
    },

    // Called from the "Select page to add version test to" dialog
    addExistingItemTest: function () {
      this.selectPagesToTest.addExistingItemTest();
    },

    showLastReport: function () {
      $("[data-tab-id='{B4475B84-FB33-4BA2-A164-C6CE1DD0D774}']").trigger('click');
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

    testStatusChanged: function () {
      var status = this.self.ItemInfoDataSource.get("status");
      if (status === "Active") {
        this.self.set("mode", "report");
        this.self.loadTest(function(app){
          app.showLastReport();

          app.AddPage.set("isEnabled", false);
          app.ExpectationSlider.set("isEnabled", false);
          app.FirstStartButton.set("isEnabled", false);

          if (app.BottomStartButton) {
            app.BottomStartButton.set("isEnabled", false);
          }
        });
      }
      else if (status === "Test stopped") {
        // Make sure this is an initial load and not a change from saving
        if (!this.self.savedOptions) {
          var res = false;
          if (!this.self._forceLoad) {
            res = confirm("The selected item already has a test defined.\r\nWould you like to edit the existing test?"); // todo: translate
          }

          if (res || this.self._forceLoad) {
            this.self.loadTest();
          }
        }
      }
    },

    loadTest: function (callback) {
      var self = this;
      this.actions.loadPageTest(this.get(this._testItemUriProperty), function (data) {
        self.selectPagesToTest.loadTest(data);
        self.reviewTest.loadTest(data);
        if (callback) {
          callback(self);
        }
      });
    },

    saveTest: function () {
      var options = this.createTestOptions();
      this.savedOptions = options;
      this.actions.savePageTest(options);
      this.invalidated = false;
      this.ItemInfoDataSource.refresh();
    },

    startTest: function () {
      var options = this.createTestOptions();
      this.savedOptions = options;
      var self = this;
      this.actions.savePageTest(options, true, function () {
        self.actions.startPageTest({
          ItemUri: options.ItemUri
        }, function () {
          self.ItemInfoDataSource.refresh();
          self.invalidated = false;
        });
      });
    },

    createTestOptions: function () {
      var options = {
        ItemUri: this.get(this._testItemUriProperty)
      };

      this.selectPagesToTest.createTestOptions(options);
      this.reviewTest.createTestOptions(options);

      return options;
    },

    setSelectedExperience: function () {
      var selected = this.control.get("selectedItem");
      if (!selected) {
        return;
      }

      // not sure why this is needed. Can we get rid of it?
      this.app.set("selectedExperience", {}, { silent: true });

      this.app.set("selectedExperience", {
        Combination: selected.Combination,
        GoalId: selected.GoalId,
        Description: selected.Description
      });
    },

    notifyExperienceChange: function () {
      var experience = this.app.get("selectedExperience");
      if (!experience) {
        this.app.DetailPanel.set("isOpen", false);
        return;
      }

      this.app.DetailPanel.set("isOpen", true);

      var combinationstring = "";

      for (var i = 0; i < experience.Combination.length; i++) {
        combinationstring += experience.Combination[i].toString();
      }

      this.app.ExperienceKPIDataSource.set("goalId", experience.GoalId);
      this.app.ExperienceKPIDataSource.set("combination", combinationstring);
      this.app.DetailThumbnailImage.set("combination", combinationstring);
      this.app.DetailThumbnailImage.set("baseLinkUrl", "/?sc_mode=edit&sc_itemid=" + this.app.DetailThumbnailImage.get("itemId"));
      this.app.TopGoalsDataSource.set("combination", combinationstring);
      this.app.AllGoalsDataSource.set("combination", combinationstring);
      this.app.TopClicksToPagesDataSource.set("combination", combinationstring);
      this.app.AllClicksToPagesDataSource.set("combination", combinationstring);
      this.app.SiteUsageDataSource.set("combination", combinationstring);

      this.app.ReachDataSource.set("isBusy", false);
      this.app.ReachDataSource.set("combination", combinationstring);
      
      this.app.TestActions.set("combination", combinationstring);
    },

    confirmWinner: function(){
      this.WinnerButton.set("isEnabled", false);
      this.AppProgressIndicator.set("isBusy", true);

      this.ConfirmDialogWindow.hide();
      this.TestActions.stopTest(this.stopTestSucceeded, this.stopTestError, this);
    },

    pickWinner: function () {
      this.ConfirmDialogWindow.show();
    },

    stopTestSucceeded: function () {
      this.AppProgressIndicator.set("isBusy", false);
      this.invalidated = false;
      window.parent.location = window.parent.location.href;
      /*window.parent.location = Sitecore.Helpers.url.addQueryParameters(window.parent.location.href, {
        report: true
      });*/
    },

    stopTestError: function(){
      this.AppProgressIndicator.set("isBusy", false);
      var text = this.Texts.get("An error occurred");
      if (!text) {
        text = "An error occurred";
      }
      alert(text);
      this.WinnerButton.set("isEnabled", true);
    },

    handleTestObjectives: function () {
      var conversions = this.TestDefinitionDataSource.get("conversions");
      if (conversions !== undefined && conversions.length > 0) {
        var conversion = conversions[0];
        this.GoalsListFiltered.set("selectedItem", conversion);
      }
    },

  });

  return PageTest;
});