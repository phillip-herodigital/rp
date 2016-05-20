Sitecore.Speak.component(["sitecore", "bootstrap", "jquery"], {
  name: "ToolTip",
    initialize: function () {
      this.tooltip = {};
      this.tipOptions = {};
    },
    initialized: function () {
      var domPrefix = "DOM:";

      this.updateOptions();
      //target control can be passed as a selector or as an id of existing SPEAK control
      if (this.TargetControl && this.TargetControl.indexOf(domPrefix) != -1) {
        this.$target = $(this.TargetControl.replace(domPrefix, ""));
      } else {
        this.$target = $("[data-sc-id='" + this.TargetControl + "']");
      }

      this.tooltip = this.renderTooltip();

      this.on("change:IsVisible", this.toggle, this);

      this.on("change:Content", this.updateView, this);
      this.on("change:Title", this.updateView, this);
    },
    toggle: function () {
      if (this.IsVisible) {
        this.tooltip.show();
      } else {
        this.tooltip.hide();
      }
    },
    destroyTooltip: function() {
        if (this.Simple) {
          this.$target.tooltip("destroy");
        } else {
          this.$target.popover("destroy");
        }
    },
    renderTooltip: function () {

      this.destroyTooltip();

      if (this.Simple) {
        this.$target.tooltip(this.tipOptions);
        return this.$target.data("tooltip");
      } else {
        this.$target.popover(this.tipOptions);
        return this.$target.data("popover");
      }
    },
    capitaliseFirstLetter: function (string)
    {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    updateOptions: function () {
      var tempVal;

      var res = {
        html: false,
        placement: 'bottom',
        content: "",
        selector: false,
        title: '',
        trigger: 'hover',
        delay: 0,
        simple: true,
        target: ''
      };

      if (this.ContainsHTML) {
        res.html = true;
      }

      if (this.TriggerOption) {
        res.trigger = this.TriggerOption;
      }
      
      for (var key in res) {
        var val = this[this.capitaliseFirstLetter(key)];
        
        if (val) {
          switch (key) {
            case "content":
              if (val.indexOf("javascript:") === 0) {
                tempVal = val;
                val = this.toFunction(tempVal);
              }
              if (this.Simple) {
                res["title"] = val;
              } else {
                res["content"] = val;
              }
              break;

            case "title":
              if (val.indexOf("javascript:") === 0) {
                tempVal = val;
                val = this.toFunction(tempVal);
              }
              if (!this.Simple) {
                res["title"] = val;
              }
              break;

            default:
              res[key] = val;
              break;
          }
        }
      }

      this.tipOptions = res;
    },
    updateView: function () {
      this.updateOptions();
      this.tooltip = this.renderTooltip();
    },
    toFunction: function(str) {
      return function () {
        str = str.replace("javascript:", "");
        return eval('(' + str + ')()');
      };
    }
  });