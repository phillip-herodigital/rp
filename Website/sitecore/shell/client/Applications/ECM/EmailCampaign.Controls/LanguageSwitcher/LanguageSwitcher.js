define(["sitecore", "/-/speak/v1/ecm/CompositeComponentBase.js"], function (_sc, CompositeComponentBase) {

  var model = _sc.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();
      this.set('isEnabled', true);
    }
  });

  var view = CompositeComponentBase.view.extend({
    childComponents: [
      "DropDownButton"
    ],

    initialize: function () {
      this._super();
      this.attachEventHandlers();
      this.model.set('selectedLanguage', this.$el.data('sc-defaultlanguage'));
      var activeLanguages = this.getActiveLanguages();
      if (activeLanguages.length === 1) {
        this.model.set("selectedReportLanguage", "0");
      }
      this.anchorsPreventDefault();
    },

    anchorsPreventDefault: function() {
      this.$el.find('a').on('click', function (e) {
        e.preventDefault();
      });
    },

    attachEventHandlers: function() {
      this.$el.find('a.language-item')
        .on('click', _.bind(this.selected, this));
      this.model.on('change:isEnabled', function() {
        this.children.DropDownButton.set('isEnabled', this.model.get('isEnabled'));
      }, this);
    },

    getActiveLanguages: function () {
      return this.$el.find(".sc-actionMenu-item.selected");
    },

    getAvailableLanguagesList: function () {
      var langs = [];
      $.each(this.$el.find('[data-isocode]'), function () {
        var language = $(this).data('isocode');

        if (language != "sc-report-language-all") {
          langs.push(language);
        }
      });

      return langs;
    },

    selected: function (event) {
      if (this.model.get('isEnabled')) {
        var isoCode = $(event.target).data("isocode");
        var btnLabel = isoCode.substring(0, 2).toUpperCase();
        if (isoCode == "sc-report-language-all") {
          btnLabel = _sc.Resources.Dictionary.translate("All").toUpperCase();
        }

        this.children.DropDownButton.set('text', btnLabel);
        this.children.DropDownButton.set('tooltip', $(event.target).text());
        this.children.DropDownButton.set('isOpen', false);
        this.$el.find("a.language-item").removeClass("isdefault");
        $(event.target).addClass("isdefault");

        if (isoCode != "sc-report-language-all") {
          this.model.set("selectedLanguage", isoCode);
          this.model.set("selectedReportLanguage", isoCode);
        } else {
          // LCID = 0
          this.model.set("selectedReportLanguage", "0");
        }
      }
    },

    languageAdded: function (language) {
      if (!language) { return; }
      var select = "a.language-item[data-isocode=\'" + language + "\']";
      var link = this.$el.find(select).first();
      if (!link) { return; }
      link.parent().addClass("selected");
    },

    setSelectedLanguages: function (languages) {
      this.$el.find("a.language-item").parent().removeClass("selected");
      _.each(languages, _.bind(function (language) {
        if (!language) { return; }
        var select = "a.language-item[data-isocode=\'" + language + "\']";
        var link = this.$el.find(select).first();
        if (!link) { return; }
        link.parent().addClass("selected");
      }, this));
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
      this.children.DropDownButton.set('text', language.substring(0, 2).toUpperCase());

      this.$el.find("a.language-item").removeClass("isdefault");
      this.$el.find("a.language-item[data-isocode=" + this.model.get("selectedLanguage") + "]").addClass("isdefault");
    },

    getLanguageList: function (contextApp) {
      var langs = [];
      var id = "isocode";
      var control = this;
      $.each(contextApp.LanguageSwitcher.viewModel.$el.find('[data-' + id + ']'), function () {
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

    showAllLanguagesItem: function () {
      var allLanguagesMenuItem = this.$el.find(".language-all");

      allLanguagesMenuItem.removeClass("hidden");
      if (this.model.get("selectedReportLanguage") == "" || this.model.get("selectedReportLanguage") == "0") {
        this.children.DropDownButton.set('text', _sc.Resources.Dictionary.translate("All").toUpperCase());
        this.children.DropDownButton.set('tooltip', _sc.Resources.Dictionary.translate("All languages"));
        
        this.model.set("selectedReportLanguage", "0");

        this.$el.find("a.language-item").removeClass("isdefault");
        $("a", allLanguagesMenuItem).addClass("isdefault");
      }
    },

    hideAllLanguagesItem: function () {
      var allLanguagesMenuItem = this.$el.find(".language-all");

      allLanguagesMenuItem.addClass("hidden");
      this.setSelectedLanguage(this.model.get("selectedLanguage"));

      this.$el.find("a.language-item").removeClass("isdefault");
      var selectedLanguageElement = this.$el.find("a.language-item[data-isocode='" + this.model.get("selectedLanguage") + "']");
      selectedLanguageElement.addClass("isdefault");
      this.children.DropDownButton.set('tooltip', selectedLanguageElement.text());
      this.model.trigger("change:selectedLanguage");
    }
  });

  return _sc.Factories.createComponent("LanguageSwitcher", model, view, ".sc-ecm-language");
});