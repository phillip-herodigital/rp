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
    invalidated: false,

    initialized: function () {
      // workaround
      modeFix.fixModeCookies();

      var self = this;
      
      this.AppProgressIndicator.set("isBusy", true);

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

      // Ensure carousel redraws when visible so elastislider can work out it's dimensions
      this.Tabs.on("change:selectedTab", this.CarouselImage.viewModel.populateCarousel, this);

      //this.SelectPageWindow.show();

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
      
      var uri = Sitecore.Speak.Helpers.url.getQueryParameters(window.location.href);
      var databaseUri = new _sc.Definitions.Data.DatabaseUri("master");
      var db = new _sc.Definitions.Data.Database(databaseUri);
      var item = db.getItem(uri.id, function(item){
        self.set("selectedTemplateId", item.$templateId);
        self.selectTestPage(uri.id);
      });
      
      

      // check if we have a previously started test saved in the parent
      var key = "saved" + uri.id;
      if (window.top[key]) {
        this.loadTest(window.top[key]);
      }
      
      var closeCheck = function (ev) {
        if (!self.invalidated) {
          return;
        }

        var current = self.createTestOptions();
        if (!_.isEqual(self.savedOptions, current)) {
          window.top[key] = current;
        }
      };

      // bind both beforeunload and unload as beforeunload is proprietry
      $(window).on("beforeunload", closeCheck);
      $(window).unload(closeCheck);
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
    },

    initReviewTab: function () {
      this.reviewTest = new reviewTestMod.ReviewTest({
        hostPage: this,
        testItemsProperty: selectPagesToTestMod.testItemsProperty,
        testItemUriProperty: this._testItemUriProperty
      });

      this.CarouselImage.set("imageThumbs", new thumbsMod.ImageThumbs({
        dictionary: this.Texts
      }));
    },

    selectTestPage: function (itemid) {
      var itemId = itemid;
      var itemTempateId = this.get("selectedTemplateId");
      if (itemId === undefined)
      {
        itemId = this.get("selectedItemId");
        if (!itemId || itemId.length === 0) {
          alert(this.Texts.get("You must select a page to test"));
          return;
        }
      }

      var self = this;
      versionInfoMod.getLatestVersionNumber(itemId, function (id, version, revision) {
        var uri = new dataUtilMod.DataUri();
        uri.id = id;
        uri.ver = version;
        uri.rev = revision;

        self.set(self._testItemUriProperty, uri.toString());
		self.set(self._testItemTemplateIdProperty, itemTempateId);
        self.AppProgressIndicator.set("isBusy", false);
        self.SelectPageWindow.hide();
      });
    },

    // Called from the "Add page to test" dialog
    addPageVersionTestItem: function () {
      this.selectPagesToTest.addPageVersionTestItem();
    },

    // Called from the "Add page to test" dialog
    selectExistingItemTestItem: function () {
      this.selectPagesToTest.selectExistingItemTestItem();
    },

    // Called from the "Select page to add version test to" dialog
    addExistingItemTest: function () {
      this.selectPagesToTest.addExistingItemTest();
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
        }, function() {
          self.ItemInfoDataSource.refresh();
          window.top.location = window.top.location.href;
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

    loadTest: function (options) {
      this.selectTestPage(options.ItemUri);
      this.selectPagesToTest.loadTest(options);
      this.reviewTest.loadTest(options);
    },
    
    close: function() {
      var frame = window.frameElement;
      $(frame).hide();
    }
  });

  return PageTest;
});