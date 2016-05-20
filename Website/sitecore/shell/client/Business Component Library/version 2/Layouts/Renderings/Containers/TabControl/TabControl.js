(function (speak, $) {

  require.config({
    paths: {
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
      selection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Selection"
    }
  });
  speak.component(["collection", "selection", "scSpeakObservableArray", "knockout"], function (Collection, Selection, observableArray, ko) {
    
    function renderSelectedLazyTab(component) {
      if (component.SelectedItem.$layout === "" && component.SelectedItem.IsLazyLoaded === "1") {
        loadLazyTab(component);
      }
    }

    function renderTabContent(component, item, callBack) {
      callBack = callBack || function () { };

      var contentWrap = component.$el.find("[data-sc-content-for='" + item["$itemId"] + "']");
      if (contentWrap.children().length === 0) {
        if (item) {
          component.app.insertMarkups(
            item.$layout,
          { el: contentWrap[0] }, callBack);
        }
      }
    }

    function renderNonLazyTabs(component) {
      var tabsToLoad = _.filter(component.DynamicData, function(item) {
        return item.IsLazyLoaded !== "1";
      });

      renderNextNonLazyTab(component, tabsToLoad);
    }

    function renderNextNonLazyTab(component, tabsToLoad) {
      if (tabsToLoad.length < 1) {
        return;
      }

      renderTabContent(component, tabsToLoad.shift(), function () {
        renderNextNonLazyTab(component, tabsToLoad);
      });
    }

    function transformItemsToBindable(hookEvent) {
      var rawData = hookEvent.data, obsArray;
      if (!rawData) {
        return;
      }
      //this.ObservableItems.reset();
      obsArray = new observableArray([]);
      _.each(rawData, function (item) {
        obsArray.push(new speak.bindable(item));
      }, this);

      hookEvent.result(obsArray);

    }

    //this method used to scroll the tabs navigation that the selected tab becomes visible 
    function adjustSelectedTabPosition(component) {
      var $selectedTab = component.$el.find(">.sc-tab-control-nav-wrap .sc-tab-control-tab-item.selected"),
        $wrap = component.$el,
        offset = ($selectedTab.offset()) ? $selectedTab.offset().left - $wrap.offset().left : 0,
          totalNavWidth = calculateTotalNavWidth(component);

      //check whether there is a need to scroll the tabs
      if (!$selectedTab.offset() || totalNavWidth <= component.$el.width()) {
        return;
      }

      //check whether selected tab is not on the middle of the navigation 
      if (offset > $wrap.width() / 2) {
        var continueScrolling = true;
        while (offset > $wrap.width() / 2 && offset > 0 && continueScrolling) {
          continueScrolling = scrollTab(component, "left");
          offset = $selectedTab.offset().left - $wrap.offset().left;
        }
      }
    };

    function setupClasses(component) {
      component.$el.find(".sc-tab-control-tab-item").removeClass("before-selected").removeClass("after-selected");
      var $selectedTab = component.$el.find(".sc-tab-control-tab-item.selected");
      if ($selectedTab.length > 0) {
        $selectedTab.prev().addClass("before-selected");
        $selectedTab.next().addClass("after-selected");
      }
    }
    
    function loadLazyTab(component) {
      var $tabContent, dataItem = component.SelectedItem;

      if (component.IsBusy) return;
      //load content if it's LazyLoaded
      if (dataItem["IsDisabled"] !== "1" && dataItem["IsLazyLoaded"] === "1" && dataItem["$layout"] === "") {
        component.IsBusy = true;
        $tabContent = component.$el.find("[data-sc-content-for='" + dataItem.itemId + "']").eq(0);
        $tabContent.html("");
        component.app.insertRendering(dataItem.itemId, { el: $tabContent[0] }, function () {
          dataItem["$layout"] = $tabContent.html();
          component.IsBusy = false;
        });
      }
    }

    function calculateTotalNavWidth(component) {
      var totalWidth = 0;

      component.$el.find(">.sc-tab-control-nav-wrap .sc-tab-control-tab-item").each(function() {
        totalWidth += $(this).outerWidth();
      });

      return totalWidth;
    }

    function toggleArrows(component) {
      var totalWidth = calculateTotalNavWidth(component),
        $tabWrap = component.$el,
        $scrollContent = $tabWrap.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav"),
        $tabLeftBtn = $tabWrap.find(">.sc-tab-control-nav-wrap>.sc-tab-control-button-left"),
        $tabRightBtn = $tabWrap.find(">.sc-tab-control-nav-wrap>.sc-tab-control-button-right");

      if (totalWidth > $tabWrap.width()) {
        $tabLeftBtn.show();
        $tabRightBtn.show();
      } else {
        $tabLeftBtn.hide();
        $tabRightBtn.hide();
        $scrollContent.offset({ 'left': $tabWrap.offset().left });
      }

    }

    function scrollTab(component, direction) {
      var $scrollContent = component.$el.find(">.sc-tab-control-nav-wrap>.sc-tab-control-nav"),
        offset = 100,
        $tabWrap = component.$el,
        totalWidth = calculateTotalNavWidth(component);

      if (direction === "left") {
        if ($tabWrap.width()-32 > totalWidth+$scrollContent.offset().left-$tabWrap.offset().left)
          return false;
        $scrollContent.offset({ 'top': $scrollContent.offset().top, 'left': $scrollContent.offset().left - offset });
      }

      if (direction === "right") {
        if ($scrollContent.position().left >= 0)
          return false;
        $scrollContent.offset({ 'top': $scrollContent.offset().top, 'left': $scrollContent.offset().left + offset }); 
      }
      return true;
    }

    //used on load to select appropriate tab accordingly to query string
    function syncWithUrl(component) {
      var urlParam = "", tab;

      if (component && component.id) {
        urlParam = speak.utils.url.parameterByName(component.id);
      }

      if (speak.utils.is.a.guid(urlParam)) {
        component.selectByValue(urlParam);
      } else {
        if (urlParam !== "") {
          tab = component.findWhere({ "QueryParameterValue": urlParam });
          if (tab) {
            component.select(tab);
          } else {
            console.log(component.id + " doesn't contain any tab with 'QueryParameterValue' set to " + urlParam);
          }
        }
      }
    }

    //TODO: move it under speak.utils.url
    // Update the appropriate href query string parameter
    function paramReplace(queryString, name, value) {
      // Find the param with regex
      // Grab the first character in the returned string (should be ? or &)
      // Replace our href string with our new value, passing on the name and delimeter

      var re = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var matches = re.exec(queryString);
      var newString;

      if (matches === null && queryString === "") {
        // if there are no params, append the parameter
        newString = queryString + '?' + name + '=' + value;
      } else {
        var delimeter = "&";
        if (matches !== null) {
          delimeter = matches[0].charAt(0);
          newString = queryString.replace(re, delimeter + name + "=" + value);
        } else {
          newString = queryString + delimeter + name + "=" + value;
        }
        
      }
      return newString;
    }

    function updateQueryParameter(component) {
      var urlQuery = window.location.search;
      if (component.SelectedItem["QueryParameterValue"]) {
          urlQuery = paramReplace(urlQuery, component.id, component.SelectedItem["QueryParameterValue"]);
          history.pushState("", "", urlQuery);
      }
    }

    function selectTab(e) {
      var dataItem = ko.dataFor(e.target);

      if (speak.utils.is.a.function(dataItem["IsDisabled"]) && dataItem["IsDisabled"]() === "1") {
        return;
      }

      if (speak.utils.is.a.function(dataItem["$itemId"])) {
        this.selectByValue(dataItem["$itemId"]());
      } else {
        this.select(dataItem);
      }
      //else
      processSelection.call(this);

    }

    function processSelection(isFirstLoad) {
      if (isFirstLoad !== true) {
        updateQueryParameter(this);
      }
      syncWithUrl(this);
      setupClasses(this);
      renderSelectedLazyTab(this);
    }

    function leftArrowClick() {
      scrollTab(this, "right");
    }

    function rightArrowClick() {
      scrollTab(this, "left");
    }
    
    function setPropertyAt(component, index, name, value) {
      var item;
      if (!index && index !== 0) {
        return;
      }
      item = component.Items.array[index];
      if (!item) {
        return;
      }
      item[name] = value;
      item = component.at(index);
      item[name] = value;
      component.trigger("itemPropertyChanged", index, name, value);      
    }
    
    function getPropertyAt(component, index, name) {
      var item;
      if (!index && index !== 0) {
        return;
      }
      item = component.Items.array[index];
      if (!item) {
        return;
      }
      return item[name];
    }
    
    function processDisabled() {
      var el = this.$el.find(".sc-tab-control-content-disabled");
      el.removeClass("selected");
      if (this.SelectedItem && this.SelectedItem.IsDisabled === "1") {
        el.addClass("selected");
      }      
    }

    return speak.extend({}, Collection.prototype, Selection.prototype, {
      name: "TabControl",

      initialize: function () {
        //this property is used to determine when to show the scrolling arrows
        this.defineComputedProperty("TabControlMinWidth", function () {
          if (!this.Items || !this.Items.length || !this.TabMinWidth) {
            return "";
          }
          return this.Items.length * parseInt(this.TabMinWidth) + "px";
        });

        this.$el = $(this.el);
        this.defineProperty("IsBusy", false);
      },

      initialized: function () {

        // Register hook before super is called on Collection,
        // to also transform data to observable array of bindable objects
        this.on("hook:Items", transformItemsToBindable, this);
        this.on("itemPropertyChanged", processDisabled, this);
        this.on("change:SelectedItem", processDisabled, this);

        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);
        setupClasses(this);

        //when the user click "back" button in the browser we need to Sync it with tab selection
        $(window).on("popstate", $.proxy(syncWithUrl, this, this));
        this.on("change:Items", renderSelectedLazyTab, this);
        $(window).on("resize", $.proxy(toggleArrows, this, this));
        $(window).on("resize", $.proxy(adjustSelectedTabPosition, this, this));
        this.$el.on("click", ">.sc-tab-control-nav-wrap .sc-tab-control-tab-item", $.proxy(selectTab, this));
        this.$el.on("click", ">.sc-tab-control-nav-wrap .sc-tab-control-button-left", $.proxy(leftArrowClick, this));
        this.$el.on("click", ">.sc-tab-control-nav-wrap .sc-tab-control-button-right", $.proxy(rightArrowClick, this));
        this.on("change:SelectedItem", processSelection, this);
      },

      afterRender: function () {
        renderNonLazyTabs(this);
        processSelection.call(this, true);
        toggleArrows(this);
        adjustSelectedTabPosition(this);
      },

      setHeader: function (index, header) {
        if (!index && index !== 0 && !header) {
          return;
        }
        setPropertyAt(this, index, this.DisplayFieldName, header);
      },

      toggleEnabledAt: function (index) {
        if (!index && index !== 0) {
          return;
        }
        var value = "1";
        if (getPropertyAt(this, index, "IsDisabled") === "1") value = "";
        setPropertyAt(this, index, "IsDisabled", value);
      }

    });
  }, "TabControl");

})(Sitecore.Speak, jQuery);
