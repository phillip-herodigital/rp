define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "LanguageSwitcher",
    base: "BlockBase",
    selector: ".sc-ecm-language",
    events:
    {
      "click .js-language-switcher-btn": "toggle",
      "click .language-item": "selected",
      "click .sc-actionpanel-popup": "toggle"
    },
    attributes: [
      { name: "selectedLanguage", value: "$el.data:sc-defaultlanguage" },
      { name: "isEnabledMenu", value: "true" }
    ],
    initialize: function () {
      this._super();
    },
    toggle: function () {
      if (this.model.get("isEnabledMenu")) {
        this.$el.find(".js-language-switcher-list").toggle();
        this.$el.find(".sc-actionpanel-popup").toggle();
      }
    },
    getAvailableLanguagesList: function () {
      var langs = [];
      $.each(this.$el.find('*[data-isocode]'), function () {
        var language = $(this).data('isocode');

        if (language != "sc-report-language-all") {
          langs.push(language);
        }
      });

      return langs;
    },
    selected: function (event) {
      var isoCode = $(event.target).data("isocode");
      var btnLabel = isoCode.substring(0, 2).toUpperCase();
      if (isoCode == "sc-report-language-all") {
        btnLabel = _sc.Resources.Dictionary.translate("All").toUpperCase();
      }

      this.$el.find(".js-language-switcher-btn").text(btnLabel).attr('title', $(event.target).text());
      this.toggle();
      this.$el.find("a.language-item").removeClass("isdefault");
      $(event.target).addClass("isdefault");

      if (isoCode != "sc-report-language-all") {
        this.model.set("selectedLanguage", isoCode);
        this.model.set("selectedReportLanguage", isoCode);
      } else {
        // LCID = 0
        this.model.set("selectedReportLanguage", "0");
      }
    },
    languageAdded: function (language) {
      if (!language) { return; }
      var select = "a.language-item[data-isocode=\'" + language + "\']";
      var link = this.$el.find(select).first();
      if (!link) { return; }
      link.parent().addClass("selected");
    },
    setSelectedLanguage: function (language) {
      if (!language) {
        return;
      }

      var currentTabId = this.app.MessageContext.get("currentTabId");

      // only update the selected report language if current tab is Reports
      if (currentTabId == "{EDC344C1-AB9E-46DC-86DC-854D23FFAE3A}" || currentTabId == "{20285854-1840-43F8-89A8-1AA6C3681F31}" || currentTabId == "{1F4D7552-A64E-4456-A52F-2633DF4480CA}") {
        this.model.set("selectedReportLanguage", language);
      }

      this.model.set("selectedLanguage", language);
      
      this.$el.find(".js-language-switcher-btn").text(language.substring(0, 2).toUpperCase());
    },
    getLanguageList: function (contextApp) {
      var langs = [];
      var id = "isocode";
      var control = this;
      $.each(contextApp.LanguageSwitcher.viewModel.$el.find('*[data-' + id + ']'), function () {
        if ($(this).parent().hasClass("selected")) {
          langs.push($(this).data(id));
          if ($(this).hasClass("isdefault")) {
            var toolTip = $(this).text();
            control.$el.attr("data-sc-defaultlanguagetooltip", toolTip);
            control.$el.attr("data-sc-defaultlanguage", $(this).data(id));
          }
        }
      });

      return langs;
    },
    updateViewByTabId: function (currentTabId) {
      // if we're in drafts, then don't do anything
      if (this.app.MessageContext.get("messageState") == 0) {
        return;
      }

      var activeLanguages = this.$el.find("div.language-switcher-list li.sc-actionMenu-item.selected");
      if (activeLanguages.length === 1) {
        this.model.set("selectedReportLanguage", "0");
        return;
      }

      var btn = this.$el.find(".js-language-switcher-btn");
      var allLanguagesMenuItem = this.$el.find(".language-all");

      // if current Tab is Reports
      if (currentTabId == "{EDC344C1-AB9E-46DC-86DC-854D23FFAE3A}" || currentTabId == "{20285854-1840-43F8-89A8-1AA6C3681F31}" || currentTabId == "{1F4D7552-A64E-4456-A52F-2633DF4480CA}") {

        allLanguagesMenuItem.removeClass("hidden");

        if (this.model.get("selectedReportLanguage") == "" || this.model.get("selectedReportLanguage") == "0") {
          btn.text(_sc.Resources.Dictionary.translate("All").toUpperCase());

          btn.attr("title", _sc.Resources.Dictionary.translate("All languages"));
          this.model.set("selectedReportLanguage", "0");

          this.$el.find("a.language-item").removeClass("isdefault");
          $("a", allLanguagesMenuItem).addClass("isdefault");
        }
      } else {
        allLanguagesMenuItem.addClass("hidden");
        this.setSelectedLanguage(this.model.get("selectedLanguage"));
        
        this.$el.find("a.language-item").removeClass("isdefault");
        var selectedLanguageElement = this.$el.find("a.language-item[data-isocode='" + this.model.get("selectedLanguage") + "']"); 
        selectedLanguageElement.addClass("isdefault");
        btn.attr("title", selectedLanguageElement.text());
        this.model.trigger("change:selectedLanguage");
      }
    }
  });
});