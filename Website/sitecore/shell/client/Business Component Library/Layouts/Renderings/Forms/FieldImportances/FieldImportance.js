/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
  var model = _sc.Definitions.Models.ComponentModel.extend(
    {
      initialize: function (options) {
        this._super();
      }
    });

  var view = _sc.Definitions.Views.ComponentView.extend(
    {
      initialize: function (options)
      {
        this._super();

        var id = this.$el.attr("data-sc-id");

        var text = this.$el.text();
        if (text)
        {
          this.elements = $.parseJSON(text).fields;
        }
        else
        {
          this.elements = [];
        }
        this.target = this.$el.attr("data-sc-target");

        _sc.on("more:" + this.target, this.more, this);
        _sc.on("less:" + this.target, this.less, this);
        _sc.on("opened:" + this.target, this.opened, this);
        _sc.on("closed:" + this.target, this.closed, this);
        _sc.on("focus:" + id, this.focus, this);

        this.promotedFieldTemplate = '<a href="#" onclick="javascript: return Sitecore.trigger(\'focus:' + id + '\', \'<%= el %>\')"><%= text %></a>';
      },

      focus: function (el)
      {
        _sc.trigger("open:" + this.target);
        $(el).focus();
      },

      less: function ()
      {
        _.each(this.elements, function (e)
        {
          if (e.priority >= 3)
          {
            $(e.el).hide();
          }
        });
      },

      more: function ()
      {
        _.each(this.elements, function (e)
        {
          $(e.el).show();
        });
      },

      opened: function ()
      {
        _sc.trigger("hidepromotedfields:" + this.target);
      },

      closed: function ()
      {
        var elements = _.reject(this.elements, function (e)
        {
          return e.priority > 1;
        });

        var items = _.map(elements, function (e)
        {
          var text = $(e.value).val() || e.label;
          return _.template(this.promotedFieldTemplate, { text: text, el: e.value, e: e });
        }, this);

        var html = items.join(" | ");

        _sc.trigger("showpromotedfields:" + this.target, html);
      }
    });

    _sc.Factories.createComponent("FieldImportance", model, view, "script[type='text/x-sitecore-fieldimportance']");
});