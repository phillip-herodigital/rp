/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore", "bootstrap", "jquery"], function (_sc) {
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      defaults: {
        html: false,
        placement: 'bottom',
        content: "",
        selector: false,
        title: '',
        trigger: 'hover',
        delay: 0,
        simple: true,
        target: ''
      },
      initialize: function (options) {
        this._super();
        this.set("isVisible", false);
      }
    });


  var view = _sc.Definitions.Views.ControlView.extend({
    scTarget: "",
    //self: {},

    initialize: function (options) {

      this._super();

      this.isSimple = false;
      this.tooltip = {};
      this.tipOptions = {};
      var postponedRender = false,
            inpSrc = $(this.el).is(":input") ? $(this.el) : [],
            domPrefix = "DOM:", target,
            initialData = inpSrc.length > 0 ? JSON.parse(inpSrc.val()) : {};

      this.isSimple = initialData["simple"] ? true : false;

      this.tipOptions = updateOptions(initialData, this.tipOptions, this.isSimple);


      //target control can be passed as a selector or as an id of existing SPEAK control
      if (initialData["target"] && initialData["target"].indexOf(domPrefix) != -1) {
        
        target = initialData["target"].replace(domPrefix, "");
        this.scTarget = initialData["target"];
        
      } else {
        //postponedRender = true;
        target = initialData["target"];
        target = $("[data-sc-id='" + target + "']");
      }
      //if (!postponedRender) {
        this.tooltip = renderTooltip(target, this.tipOptions, this.isSimple);
      //}

      this.model.on("change:isVisible", this.toggle, this);

      this.model.on("change", this.updateView, this);

    },

    afterRender: function () {
//      var initialData, isSimple = true, tipOptions = {};
//      if (this.scTarget && this.scTarget !== "") {
//        if ("view" in eval(this.scTarget) && "el" in eval(this.scTarget).view) {
//          initialData = JSON.parse(this.$el.val());
//
//          tipOptions = updateOptions(initialData, tipOptions, initialData["simple"]);
//
//          this.tooltip = renderTooltip(eval(this.scTarget).view.el, tipOptions, initialData["simple"]);
//        }
//      }
    },

    toggle: function () {
      if (this.model.get("isVisible")) {
        this.tooltip.show();
      } else {
        this.tooltip.hide();
      }
    },

    updateView: function () {

      var changedAttrs = this.model.changedAttributes();

      //the handler of the "isVisible" property is already fired
      if (_.keys(changedAttrs).length === 1 && "isVisible" in changedAttrs) {
        return;
      }

      if ("simple" in changedAttrs) {
        this.isSimple = this.model.changedAttributes()["simple"];
      }

      this.tipOptions = updateOptions(changedAttrs, this.tipOptions, this.isSimple);
      this.tooltip = renderTooltip(target, this.tipOptions, this.isSimple);
    }
  });

  function destroyTooltip(target) {
    var tp, popover;

    tp = $(target).data("tooltip");
    popover = $(target).data("popover");

    if (tp) {
      tp.destroy();
      $(target).data("tooltip", "");
    }
    if (popover) {
      popover.destroy();
      $(target).data("popover", "");
    }
  }

  function renderTooltip(target, options, isSimple) {

    destroyTooltip(target);

    if (isSimple) {
      $(target).tooltip(options);
      return $(target).data("tooltip");
    } else {
      $(target).popover(options);
      return $(target).data("popover");
    }
  }

  function toFunction(str) {
    return function () {
      str = str.replace("javascript:", "");
      return eval('(' + str + ')()');
    };
  }

  function updateOptions(srcProps, currentOptions, isSimple) {
    var tempVal;

    var res = _.extend(currentOptions, {});

    _.map(srcProps, function (val, key) {

      switch (key) {
        case "content":
          if (val.indexOf("javascript:") === 0) {
            tempVal = val;
            val = toFunction(tempVal);
          }
          _.extend(res, isSimple ? { title: val} : { content: val });
          break;

        case "isVisible":
          res = val ? "show" : "hide";
          break;

        case "title":
          if (val.indexOf("javascript:") === 0) {
            tempVal = val;
            val = toFunction(tempVal);
          }
          _.extend(res, isSimple ? {} : { title: val });
          break;
        case "delay":
          _.extend(res, { delay: val });
          break;
         
        case "placement":
          _.extend(res, { placement: val });
          break;

        case "trigger":
          _.extend(res, { trigger: val });
          break;

        case "html":
          _.extend(res, { html: val });
          break;
      }

    });

    return res;
  }

  _sc.Factories.createComponent("Tooltip", model, view, ".sc-tooltip");
});