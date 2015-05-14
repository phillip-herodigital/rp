require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib'
});

define(["sitecore", "BindingUtil", "DataUtil", "RequestUtil"], function (_sc, bindingUtil, dataUtil, requestUtil) {
  var trailingValueVisitGUID = '{00000000-0000-0000-0000-000000000000}';

  return {
    ReviewTest: function (options) {
      var ob = {
        _host: options.hostPage,
        _testItemsProperty: options.testItemsProperty,
        _testItemUriProperty: options.testItemUriProperty,
        _loadOptions: null,

        init: function () {
          var self = this;
          this._host.on("change:" + this._testItemsProperty, this.updateCarouselItems, this);
          this._host.on("change:" + this._testItemsProperty, this.validateTest, this);
          this._host.on("change:" + this._testItemUriProperty, this.updateCarouselItems, this);

          this._host.ExpectationSlider.set("selectedValue", 0);
          this._host.CarouselImage.set("imageDescriptionHandler", this.createThumbnailDescription);
          this.validateTest();

          if (this._host.TestDurationDataSource) {
            this._host.on("change:" + this._testItemUriProperty, bindingUtil.propagateChange, {
              source: this._host,
              sourceProp: this._testItemUriProperty,
              target: this._host.TestDurationDataSource,
              targetProp: "itemUri"
            });

            this._host.on("change:" + this._testItemsProperty, bindingUtil.propagateChange, {
              source: this._host,
              sourceProp: function (source) { return (source.get(self._testItemsProperty) || []).length },
              target: this._host.TestDurationDataSource,
              targetProp: "additionalPageCount"
            });

            this._host.TestDurationDataSource.on("change:experienceCount change:viewsPerDay change:expectedDays change:requiredVisits", this.updateMessageBar, this);

            if (this._host.ConfidenceLevelSelect) {
              this._host.ConfidenceLevelSelect.on("change:selectedValue", bindingUtil.propagateChange, {
                source: this._host.ConfidenceLevelSelect,
                sourceProp: "selectedValue",
                target: this._host.TestDurationDataSource,
                targetProp: "confidence"
              });
            } else {
              this._host.TestDurationDataSource.set("confidence", this._host.StatisticsSettingsDictionary.get("ContentTesting.DefaultConfidenceLevel"));
            }
            
            if (this._host.TrafficAllocationSlider) {
              this._host.TrafficAllocationSlider.on("change:selectedValue", bindingUtil.propagateChange, {
                source: this._host.TrafficAllocationSlider,
                sourceProp: "selectedValue",
                target: this._host.TestDurationDataSource,
                targetProp: "trafficAllocation"
              });
            } else {
              this._host.TestDurationDataSource.set("trafficAllocation", 100);
            }
          }

          // Close preview accordion until test pages are added
          this._host.PreviewAccordion.set("isOpen", false);

          // Set default droplist values but wait until they are loaded. Only set if value hasn't already been set due to loading of test
          // Composite may be missing due to security
          if (this._host.ConfidenceLevelSelect) {
            this._host.ConfidenceLevelSelect.on("change:items", function () {
              var value = this._host.StatisticsSettingsDictionary.get("ContentTesting.DefaultConfidenceLevel");
              if (this._loadOptions) {
                value = this._loadOptions.ConfidenceLevel.toString();
              }
              this._host.ConfidenceLevelSelect.set("selectedValue", value);
            }, this);
          }

          // Composite may be missing due to security
          if (this._host.MaximumSelect) {
            this._host.MaximumSelect.on("change:items", function () {
              var value = this._host.SchedulingSettingsDictionary.get("ContentTesting.MaximumContentTestDuration");
              if (this._loadOptions) {
                value = this._loadOptions.MaxDuration;
              }
              this._host.MaximumSelect.set("selectedValue", value);
            }, this);
          }

          // Composite may be missing due to security
          if (this._host.MinimumSelect) {
            this._host.MinimumSelect.on("change:items", function () {
              var value = this._host.SchedulingSettingsDictionary.get("ContentTesting.MinimumDuration");
              if (this._loadOptions) {
                value = this._loadOptions.MinDuration;
              }
              this._host.MinimumSelect.set("selectedValue", value);
            }, this);
          }

          if (this._host.ObjectiveList) {
            this._host.ObjectiveList.on("change:items", function () {
              // set default
              this._host.ObjectiveList.set("selectedGuid", trailingValueVisitGUID);
              if (this._loadOptions && this._loadOptions.GoalId) {
                var value = this._loadOptions.GoalId;
                if (value[0] != "{") {
                  value = "{" + value + "}";
                }
                // need the previous 'set' call so we change the value and the change event is fired
                this._host.ObjectiveList.set("selectedGuid", value);
              }
            }, this);
          }

          if (this._host.TrafficAllocationSlider) {
            this._host.TrafficAllocationSlider.set("selectedValue", 100);            
          }

          if (this._loadOptions && this._loadOptions.SelectWinnerStrategy) {
            var winnerStrategy = this._loadOptions.SelectWinnerStrategy.toLowerCase();
            if (winnerStrategy[0] != "{") {
              winnerStrategy = "{" + winnerStrategy + "}";
            }

            if (winnerStrategy == this._host.WinnerAutoSelect.get("value").toLowerCase()) {
              this._host.WinnerAutoSelect.check();
            }

            if (winnerStrategy == this._host.WinnerAutoSelectUnless.get("value").toLowerCase()) {
              this._host.WinnerAutoSelectUnless.check();
            }

            if (winnerStrategy == this._host.WinnerManualSelect.get("value").toLowerCase()) {
              this._host.WinnerManualSelect.check();
            }
          }
        },

        loadTest: function (options) {
          // Load may occur before items populate, so store the options so defaults can be set when items are populated into controls.
          this._loadOptions = options;
          this._host.ExpectationSlider.set("selectedValue", options.Expectation);

          if (this._host.TrafficAllocationSlider) {
            this._host.TrafficAllocationSlider.set("selectedValue", options.TrafficAllocation);
          }

          // Winner strategy
          if (options.SelectWinnerStrategy && this._host.WinnerAutoSelect) {
            var winnerStrategy = options.SelectWinnerStrategy.toLowerCase();
            if (winnerStrategy[0] != "{") {
              winnerStrategy = "{" + winnerStrategy + "}";
            }

            if (winnerStrategy == this._host.WinnerAutoSelect.get("value").toLowerCase()) {
              this._host.WinnerAutoSelect.check();
            }

            if (winnerStrategy == this._host.WinnerAutoSelectUnless.get("value").toLowerCase()) {
              this._host.WinnerAutoSelectUnless.check();
            }

            if (winnerStrategy == this._host.WinnerManualSelect.get("value").toLowerCase()) {
              this._host.WinnerManualSelect.check();
            }
          }

          // Other components
          if (this._host.ConfidenceLevelSelect) {
            this._host.ConfidenceLevelSelect.set("selectedValue", options.ConfidenceLevel.toString());
          }

          if (this._host.ObjectiveList) {
            var goal = options.GoalId;
            if (goal) {
              if (goal[0] != "{") {
                goal = "{" + goal + "}";
              }
              this._host.ObjectiveList.set("selectedGuid", goal);
            }
          }

          if (this._host.MaximumSelect) {
            this._host.MaximumSelect.set("selectedValue", options.MaxDuration.toString());
          }

          if (this._host.MinimumSelect) {
            this._host.MinimumSelect.set("selectedValue", options.MinDuration.toString());
          }
        },

        createTestOptions: function(options) {
          options.SelectWinnerStrategy = null;
          options.TrackWithEngagementValue = true;
          options.TrafficAllocation = 100; // todo: read form settings
          var expectedItem = this._host.ExpectationSlider.get("selectedItem");
          if (expectedItem) {
            var iVal = 0;
            try {
              iVal = parseInt(expectedItem.Value);
              if (iVal < 0) {
                expectedItem.Value = "0";
              }                
            }
            catch (e) { };
              
          }
          options.Expectation = expectedItem != null ? expectedItem.Value : 0;
          
          if (this._host.TrafficAllocationSlider) {
            options.TrafficAllocation = this._host.TrafficAllocationSlider.get("selectedValue");
          }

          if (this._host.ObjectiveList != undefined) {
            var goal = this._host.ObjectiveList.get("selectedItem");
            if (goal) {
              options.TrackWithEngagementValue = goal.guid == '{00000000-0000-0000-0000-000000000000}';

              if (goal.guid) {
                options.GoalId = goal.guid;
              }
            }
          }

          if (this._host.get("groupTestObjective") != undefined) {
            var groupValue = this._host.get("groupTestObjective");
            options.SelectWinnerStrategy = groupValue;
          }

          if (this._host.ConfidenceLevelSelect) {
            options.ConfidenceLevel = this._host.ConfidenceLevelSelect.get("selectedValue");
          }

          if (this._host.MaximumSelect) {
            options.MaxDuration = this._host.MaximumSelect.get("selectedValue");
          }

          if (this._host.MinimumSelect) {
            options.MinDuration = this._host.MinimumSelect.get("selectedValue");
          }
        },

        updateCarouselItems: function () {
          var testItems = [new dataUtil.DataUri(this._host.get(this._testItemUriProperty))];
          _.each(this._host.get(this._testItemsProperty), function (item) {
            testItems.push(item);
          });

          this._host.PreviewAccordion.set("isOpen", testItems.length != 0);

          var carouselItems = [];
          for (var i in testItems) {
            carouselItems.push({
              name: (parseInt(i, 10) + 1) + " / " + testItems.length,
              uId: testItems[i].id + "-" + testItems[i].ver + "-" + testItems[i].rev,
              attrs: {
                id: testItems[i].id,
                version: testItems[i].ver,
                revision: testItems[i].rev,
                original: i == 0
              }
            });
          }

          this._host.CarouselImage.set("items", carouselItems);
        },

        createThumbnailDescription: function (item, $target) {
          // todo: Skynet: The descriptions should be defined inside a placeholder using SPEAK components, not in code.
          // At the very least, use an iteminfodatasource and bind it
          // problem with context. Use 'ob' instead of 'this'
          var uri = new dataUtil.DataUri();
          uri.id = item.attrs.id;
          uri.ver = item.attrs.version;
          uri.rev = item.attrs.revision;

          var url = "/sitecore/shell/api/ct/ItemInfo/GetByUri?uri=" + uri.toString();

          var ajaxOptions = {
            cache: false,
            url: url,
            context: this,
            success: function(data) {
              var desc = ob._host.Texts.get("Item:");
              desc += " " + data.Path;
              desc += "<br/>"
              desc += ob._host.Texts.get("Version:");
              desc += " " + (item.attrs.ver || data.Version) + "-" + data.Language;
              desc += "<br/>"
              desc += ob._host.Texts.get("Created:");
              desc += " " + data.CreatedDate + " " + ob._host.Texts.get("by") + " " + data.CreatedBy;

              $target.html(desc);
            }
          };

          requestUtil.performRequest(ajaxOptions);
        },

        updateMessageBar: function () {
          var experienceCount = this._host.TestDurationDataSource.get("experienceCount");

          if (experienceCount > 0) {
            var sessionsRequired = this._host.TestDurationDataSource.get("requiredVisits");
            var expectedDays = this._host.TestDurationDataSource.get("expectedDays");

            var type = "notification";
            var template;

            if (expectedDays <= 0) {
              template = _.template(this._host.Texts.get("The test will require <%= visits %> visitors to find a winner. We do not have enough historical data to provide a forecasting on duration."));
            }
            else if (expectedDays > 90) {
              // todo: move value to configuration
              type = "warning";
              template = _.template(this._host.Texts.get("Based on historical visitor data, it will take more than <%= days %> days to finish a test for the <%= pages %> pages included.  To speed up the test, disable some of the pages or adjust test settings."));
            }
            else {
              template = _.template(this._host.Texts.get("Based on historical visitor data, it will take about <%= days %> days to finish a test for the <%= pages %> pages included."));
            }

            this._host.MessageBar.removeMessages("notification");
            this._host.MessageBar.removeMessages("warning");
            this._host.MessageBar.addMessage(type, template({
              visits: sessionsRequired,
              days: expectedDays,
              pages: experienceCount
            }));
          }
        },

        validateTest: function () {
          var valid = false;

          // todo: logic for retrieving the selected pages should be in the module and not bleeding into the app
          var testPages = this._host.get(this._testItemsProperty);
          valid = testPages && testPages.length > 0;

          this._host.FirstStartButton.set("isEnabled", valid);
          if (this._host.BottomStartButton) {
            this._host.BottomStartButton.set("isEnabled", valid);
          }
        }
      };

      ob.init();
      return ob;
    }
  };
});