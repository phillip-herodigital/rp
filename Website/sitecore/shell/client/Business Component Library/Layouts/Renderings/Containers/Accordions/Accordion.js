/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.ControlModel.extend(
    {
      initialize: function (options)
      {
        this._super();
        this.set("header", "");
        this.set("imageUrl", "");
        this.set("isOpen", true);
        this.set("showAdditional", false);
        this.set("enableAdditional", false);
        this.set("contentHeight", "100%");
      }
    });

    var view = _sc.Definitions.Views.ControlView.extend(
    {
      initialize: function(options)
      {
        this._super();

        this.model.set("imageUrl", this.$el.attr("data-sc-imageurl"));
        this.model.on("change:showAdditional", function() {
          _sc.trigger((this.model.get("showAdditional") ? "more" : "less") + ":" + this.$el.attr("data-sc-id"));
        }, this);
        
        this.model.on("change:isOpen", function() {
          _sc.trigger((this.model.get("isOpen") ? "opened" : "closed") + ":" + this.$el.attr("data-sc-id"));
        }, this);

        var id = this.$el.attr("data-sc-id");

        _sc.on("hidepromotedfields:" + id, this.hidePromotedFields, this);
        _sc.on("showpromotedfields:" + id, this.showPromotedFields, this);
        _sc.on("open:" + id, this.open, this);
        _sc.on("close:" + id, this.close, this);

        this.model.set("header", this.$el.attr("data-sc-header"));
        
        this.model.set("showAdditional", false);
        var enableAdditional = this.$el.data("sc-enableadditional");                  
        if (enableAdditional === "True") {
            this.model.set("enableAdditional", true);
        }
        
        var contentHeight = this.$el.data("sc-contentheight");
        if (contentHeight != "") {
            this.model.set("contentHeight", contentHeight);
        }
        
        var isOpen = this.$el.data("sc-isopen");
        if (isOpen === "False") {
            this.model.set("isOpen", false);
        } else {
            this.model.set("isOpen", true);
        }        
      },

      close: function()
      {
        this.model.set("isOpen", false);
      },

      open: function ()
      {
        this.model.set("isOpen", true);
      },

      toggle: function ()
      {
        this.model.set("isOpen", !this.model.get("isOpen"));
      },

      toggleAdditional: function()
      {
        this.model.set("showAdditional", !this.model.get("showAdditional"));
      },

      showPromotedFields: function(html)
      {
        this.$el.find(".sc-accordion-header-promotedfields").html(html);
      },

      hidePromotedFields: function()
      {
        this.$el.find(".sc-accordion-header-promotedfields").text("");
      }
    });

    _sc.Factories.createComponent("Accordion", model, view, ".sc-accordion");
});

