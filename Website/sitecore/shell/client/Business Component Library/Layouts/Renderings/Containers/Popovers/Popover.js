/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore", "bootstrap", "jquery"], function(_sc) {
  _sc.Factories.createBaseComponent({
    name: "Popover",
    base: "ComponentBase",
    selector: ".sc-popover",
    attributes: [
      { name: "targetControl", value: "$el.data:sc-targetcontrol" },
      { name: "trigger", value: "$el.data:sc-trigger" },
      { name: "placement", value: "$el.data:sc-placement" }
    ],

    initialize: function() {
      this._super();
      var targetId = this.model.get("targetControl");
      var trigger = this.model.get("trigger") || 'click';
      var placement = this.model.get("placement") || 'auto';
      var content = $("[data-sc-id='" + this.$el.attr("data-sc-id") + "']");
      var parent = content.parent();
      var target = $("[data-sc-id='" + targetId + "']");

      target.popover({
        placement: function(tip, element) {
          if (placement !== 'auto') {
            return placement;
          }
          var offset = $(element).offset(),
              height = $(document).outerHeight(),
              width = $(document).outerWidth(),
              vert = 0.5 * height - offset.top,
              vertPlacement = vert > 0 ? 'bottom' : 'top',
              horiz = 0.5 * width - offset.left,
              horizPlacement = horiz > 0 ? 'right' : 'left';
          return Math.abs(horiz) > Math.abs(vert) ? horizPlacement : vertPlacement;
        },
        html: true,
        trigger: trigger,
        content: content,
        container: 'body',
        template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"></div></div></div>'
      }).on('hidden.bs.popover', function() {
        parent.append(content);
      });

      var adjustPosition = function() {
        if (content.is(":hidden")) {
          return;
        }

        if (target.is(":hidden") || isVisibilityHidden(target)) {
          target.popover("hide");
          return;
        }

        target.popover("show");
      };

      $(window).resize(adjustPosition);
    }
  });

  function isVisibilityHidden(target) {
    return $.grep(target.parents().andSelf(), function(el) {
      return $(el).css("visibility") == "hidden";
    }).length > 0;
  }
});



