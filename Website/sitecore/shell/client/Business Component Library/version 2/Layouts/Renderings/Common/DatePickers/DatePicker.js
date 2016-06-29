(function (speak) {
  //TODO: the major refactoring is done but some others options needs to be tested.
  speak.component(["jqueryui"], {
    name: "DatePicker",
    initialize: function () {
      //this.Translation = JSON.parse(this.TranslationJSON);
      this.$el = $(this.el);
      this.defineProperty("FormattedDate", "");
      this.days = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
        "Sunday": 7
      };
    },
    initialized: function () {
      this.FirstDay = this.days[this.FirstDay || "Monday"];
      this.setDateFormat();
      this.MinDate = this.convertDate(this.MinDate, this.Format);
      this.MaxDate = this.convertDate(this.MaxDate, this.Format);

      var propertiesLowerCase = {};
      for (var prop in this.__properties) {
        if (prop === "ShowOtherMonths" || prop === "FirstDay") {
          propertiesLowerCase[speak.utils.string.lowerFirstLetter(prop)] = this.__properties[prop];
        }
        
        if (prop === "ShowToday") {
          propertiesLowerCase["showButtonPanel"] = this.__properties[prop];
        }
      };
      
      var options = {
        onSelect: $.proxy(this.onSelect, this),
        date: this.FormattedDate
      };

      this.DatePicker = this.$el.datepicker(speak.utils.object.extend(propertiesLowerCase, options));

      this.on("change:Date", this.setFormattedDateAttribute, this);
      this.on("change:FormattedDate", this.setDateAttribute, this);
      this.on("change:Time", this.timeUpdated, this);
      this.on("change:MinDate", this.changeRange, this);
      this.on("change:MaxDate", this.changeRange, this);
      var self = this;
      this.$el.on("change", function () {
        self.setDateAttribute();
      });
      this.widget = this.$el.data("datepicker");
    },
    getDate: function () {
      return this.$el.datepicker('getDate');
    },
    setDateAttribute: function () {
      this.Date = speak.utils.date.toISO(this.getDate());
    },
    setDate: function () {
      this.Date = speak.utils.date.toISO(this.getDate());
    },
    setFormattedDateAttribute: function () {
      var datepickerDate = speak.utils.date.toISO(this.getDate());

      if (datepickerDate !== this.Date) {
        this.$el.datepicker('setDate', speak.utils.date.parseISO(this.Date));
      }
      this.FormattedDate = this.convertDate(this.Date, this.DateFormat);
    },
    setDateFormat: function () {
      var format = this.Format;
      
      if (format) {
        if (format.indexOf("yyyy") !== -1) {
          format = format.replace("yyyy", "yy");
        } else if (format.indexOf("yy") !== -1) {
          format = format.replace("yy", "y");
        }
      } else {
        format = "dd/mm/yyyy";
      }

      this.DateFormat = format;

      if (this.Date) {
        this.setFormattedDateAttribute();
      }

    },
    onSelect: function () {
      this.Date = speak.utils.date.toISO(this.getDate());
      this.$el.blur();
      var self = this;
      setTimeout(function () {
        self.fixTodayButtonClass();
      }, 10);
    },
    fixTodayButtonClass: function () {
      this.widget.dpDiv.addClass("sc-datepicker-dropdown");
      var todayBtn = this.widget.dpDiv.find("button[data-handler='today']");
      todayBtn.addClass("btn sc-button btn-default");
    },
    convertDate: function (dateString, format) {
      return speak.utils.date.toStringWithFormat(dateString, format);
    },
    // Set the date on the model which is equaled to the current date
    setCurrentDayOnClickToday: function (e) {
      if (e.target.className.search('ui-datepicker-current') != -1) {
        this.Date = speak.utils.date.toISO(new Date());
        this.$el.datepicker('setDate', new Date());
      }
      this.fixTodayButtonClass();
    },
    afterRender: function () {
      this.fixTodayButtonClass();

      if (this.$el.attr("data-date")) {
        this.Date = this.$el.attr("data-date");
      }

      this.widget.dpDiv.off("click").on("click", $.proxy(this.setCurrentDayOnClickToday, this));
    }
  });
})(Sitecore.Speak);