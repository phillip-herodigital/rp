/// <reference path="../../../../../../assets/vendors/JQuery/jquery-1.8.2.min.js" />
/// <reference path="../../../../../../assets/vendors/JQuery/jquery-ui-1.8.23.custom.min.js" />
/// <reference path="../../../../../../assets/vendors/Base/Base.js" />
/// <reference path="../../../Page/Sitecore.Page.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Models.js" />
/// <reference path="../../../../../../assets/lib/Models/Sitecore.Types.Views.js" />

define(['sitecore', 'jqueryui'], function (_sc) {
  var control = {
    componentName: "DatePicker",
    selector: ".sc-datepicker",
    control: "datepicker",
    namespace: "ui-",

    attributes:
    [
      { name: "date", defaultValue: null },
      { name: "dateFormat", defaultValue: null },
      { name: "firstDay", defaultValue: 1 },
      { name: "showOtherMonths", defaultValue: false },
      { name: "dayNamesMin", defaultValue: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
      { name: "isReadOnly", defaultValue: false, added: true },
      { name: "isEnabled", defaultValue: true, added: true }
    ],
    events:
    [
      { name: "onChangeMonthYear" },  // Called when the datepicker moves to a new month and/or year.
      { name: "onClose" },            // Called when the datepicker is closed, whether or not a date is selected.
      { name: "onSelect", on: "onSelect" },           // Called when the datepicker is selected.
      { name: "beforeShow" }          // A function that takes an input field and current datepicker instance and returns an options object to update the datepicker with. It is called just before the datepicker is displayed.
    ],
    functions:
    [
      { name: "dialog" },             // Opens the datepicker in a dialog box.
      { name: "getDate" },            // Returns the current date for the datepicker or null if no date has been selected.
      { name: "hide" },               // Close a previously opened date picker.
      { name: "isDisabled" },         // Determine whether a date picker has been disabled.
      { name: "refresh" },            // Redraw the date picker, after having made some external modifications.
      { name: "setDate" },            // Sets the date for the datepicker.
      { name: "show" }                // Open the date picker. If the datepicker is attached to an input, the input must be visible for the datepicker to be shown.
    ],
    
    view:
    {
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
        this.model.set("date", this.$el.val());
        this.model.set("firstDay", days[this.$el.attr("data-firstday")]);
        this.model.set("showOtherMonths", this.$el.attr("data-showothermonths") === "true");
        this.$el.attr("readonly") ? this.model.set("isReadOnly", this.$el.attr("readonly")) : $.noop();
        this.model.set("isEnabled", !this.$el.is(":disabled"));
      },
      
      afterRender: function () {
        this._widget = this.$el.data("datepicker");
        this._widget.dpDiv.addClass("sc-datepicker-dropdown");
      },
      
      onSelect: function () {
        this.model.set("date", this.$el.val());
      }
      

    }
  };

  _sc.Factories.createJQueryUIComponent(_sc.Definitions.Models, _sc.Definitions.Views, control);
});