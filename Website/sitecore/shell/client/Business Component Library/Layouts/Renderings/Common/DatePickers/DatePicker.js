/// <reference path="../../../../../../assets/vendors/JQuery/jquery-1.8.2.min.js" />
/// <reference path="../../../../../../assets/vendors/JQuery/jquery-ui-1.8.23.custom.min.js" />
/// <reference path="../../../../../../assets/vendors/Base/Base.js" />
/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
/// <reference path="../../../Page/Sitecore.Page.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Models.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Views.js" />

/*jslint nomen: true, indent: 2 */
/*global define: false, $: false, _: false */

define(['sitecore', 'jqueryui'], function (_sc) {
  "use strict";

  var control = {
    componentName: "DatePicker",
    selector: ".sc-datepicker",
    control: "datepicker",
    namespace: "ui-",

    attributes: [
      { name: "formattedDate", defaultValue: null },
      { name: "date", defaultValue: null },
      { name: "dateFormat", defaultValue: null },
      { name: "firstDay", defaultValue: 1 },
      { name: "showOtherMonths", defaultValue: false },
      { name: "isReadOnly", defaultValue: false, added: true },
      { name: "isEnabled", defaultValue: true, added: true },

      // Localization attributes
      { name: "prevText", defaultValue: null },
      { name: "nextText", defaultValue: null },
      { name: "monthNames", defaultValue: null },
      { name: "monthNamesShort", defaultValue: null },
      { name: "dayNames", defaultValue: null },
      { name: "dayNamesMin", defaultValue: null },
      { name: "dayNamesShort", defaultValue: null },
      { name: "yearSuffix", defaultValue: null }
    ],
    events: [
      { name: "onChangeMonthYear" },  // Called when the datepicker moves to a new month and/or year.
      { name: "onClose" },            // Called when the datepicker is closed, whether or not a date is selected.
      { name: "onSelect", on: "onSelect" },           // Called when the datepicker is selected.
      { name: "beforeShow" }          // A function that takes an input field and current datepicker instance and returns an options object to update the datepicker with. It is called just before the datepicker is displayed.
    ],
    functions: [
      { name: "dialog" },             // Opens the datepicker in a dialog box.
      { name: "getDate" },            // Returns the current date for the datepicker or null if no date has been selected.
      { name: "hide" },               // Close a previously opened date picker.
      { name: "isDisabled" },         // Determine whether a date picker has been disabled.
      { name: "refresh" },            // Redraw the date picker, after having made some external modifications.
      { name: "setDate" },            // Sets the date for the datepicker.
      { name: "show" }                // Open the date picker. If the datepicker is attached to an input, the input must be visible for the datepicker to be shown.
    ],

    view: {
      initialized: function () {
        var days = {
          "Monday": 1,
          "Tuesday": 2,
          "Wednesday": 3,
          "Thursday": 4,
          "Friday": 5,
          "Saturday": 6,
          "Sunday": 7
        };

        this.model.on("change:date", this.setFormattedDateAttribute, this);
        this.model.on("change:formattedDate", this.setDateAttribute, this);

        this.model.set("firstDay", days[this.$el.attr("data-firstday")]);
        this.model.set("showOtherMonths", this.$el.attr("data-showothermonths") === "true");
        this.model.set("isEnabled", !this.$el.is(":disabled"));

        if (this.$el.attr("readonly")) {
          this.model.set("isReadOnly", this.$el.attr("readonly"));
        } else {
          $.noop();
        }

        this.setDateFormat(this.$el.attr("data-dateformat"));

        if (this.$el.attr("data-localization")) {
          this.setLocalization();
        }

        this.overWriteSetDateMethod(this.setDate);
      },

      afterRender: function () {
        this._widget = this.$el.data("datepicker");
        this._widget.dpDiv.addClass("sc-datepicker-dropdown");

        if (this.$el.attr("data-date")) {
          this.model.set("date", this.$el.attr("data-date"));
        }
      },

      onSelect: function () {       
        this.model.off("change:date");
        this.model.set("formattedDate", this.$el.val());
        this.model.on("change:date", this.setFormattedDateAttribute, this);
        this.$el.blur();
      },

      // Sets the formattedDate on the model
      setFormattedDateAttribute: function () {
        var date = this.removeTicks(this.model.get("date")),
          dateObject,
          databaseUri,
          database;

        if (_sc.Helpers.date.isISO(date)) {
          dateObject = new Date(this.convertDate(date, "yyyy/mm/dd"));

          this.setDate(dateObject);

          if (this.model.get("formattedDate") !== this.$el.val()) {
            this.model.set("formattedDate", this.$el.val());
          }
        } else {
          databaseUri = new _sc.Definitions.Data.DatabaseUri("core");
          database = new _sc.Definitions.Data.Database(databaseUri);

          database.getItem("{77F6084F-68AE-4243-A223-C2517EDE7189}", function (item) {
            throw item.Text;
          });

          this.model.set("date", this.convertToISODate(this.getDate()));
        }
      },

      // Sets the date on the model
      setDateAttribute: function () {
        var isoDate = this.convertToISODate(this.getDate());

        if (this.model.get("date") !== isoDate) {
          this.model.set("date", isoDate);
        }
      },

      // Removes the ticks from a DateTime string
      removeTicks: function (date) {
        if (date.indexOf(":") > -1 && date.indexOf(":") === 15) {
          date = date.substring(0, date.indexOf(":"));
        }

        return date;
      },

      // Convert the ISO date into the format given
      convertDate: function (dateString, format) {
        var dateConverter = _sc.Converters.get("date");

        return dateConverter.toStringWithFormat(dateString, format);
      },

      // Convert the date object into Sitecore ISO format
      convertToISODate: function (date) {
        var y = _sc.Helpers.date.ensureTwoDigits(date.getFullYear()),
          m = _sc.Helpers.date.ensureTwoDigits(date.getMonth() + 1),
          d = _sc.Helpers.date.ensureTwoDigits(date.getDate());

        return y + m + d + "T000000";
      },

      // Changes the format, so it matches jQuery UI date format
      setDateFormat: function (format) {
        if (format) {
          if (format.indexOf("yyyy") !== -1) {
            format = format.replace("yyyy", "yy");
          } else if (format.indexOf("yy") !== -1) {
            format = format.replace("yy", "y");
          }
        } else {
          format = "dd/mm/yyyy";
        }

        this.model.set("dateFormat", format);

        if (this.model.get("date")) {
          this.setFormattedDateAttribute();
        }

      },

      // Sets localized texts
      setLocalization: function () {
        var localization = JSON.parse(this.$el.attr("data-localization"));

        // Loop through each property of the localization object, and set each property on the model
        _.each(localization, function (val, key) {
          var camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);

          this.model.set(camelCaseKey, val);
        }, this);
      },

      // jQuery UI DatePicker does not trigger an event (like change, input and so on) when setDate method 
      // is used, so we overwrite the default method, and set the date on the model with the value of $el,
      // and then execute the original setDate method
      overWriteSetDateMethod: function (func) {
        this.setDate = function () {
          var passedFunction = func.apply(this, arguments);

          this.model.set("formattedDate", this.$el.val());

          return passedFunction;
        };
      }

    }
  };

  _sc.Factories.createJQueryUIComponent(_sc.Definitions.Models, _sc.Definitions.Views, control);
});