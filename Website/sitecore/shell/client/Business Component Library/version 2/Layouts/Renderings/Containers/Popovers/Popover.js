(function (speak) {
  define(["knockout", "bootstrap"], function (ko) {
    speak.component({
      name: "Popover",
      initialize: function () {
        this.$el = $(this.el);
      },
      autoToken: /\s?auto?\s?/i,
      initialized: function () {
        this.$parent = this.$el.parent();
        this.$targetEl = $("[data-sc-id='" + this.TargetControl + "']");
        if (!this.$targetEl) {
          console.log("can't find Target ID " + this.TargetControl);
        }
        var self = this;
        this.$targetEl.popover({
          placement: function (tip, element) {
            var autoPlace = self.autoToken.test(self.Placement);

            if (!autoPlace) {
              return self.Placement;
            } else {              
              return self.calculatePlacement(self.Placement, tip, element);
            }
          },
          html: true,
          trigger: this.Trigger,
          content: this.$el,
          container: 'body',
          template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"></div></div></div>'
        }).on('hidden.bs.popover', function () {
          self.$parent.append(self.$el);
        });

        var adjustPosition = function () {
          if (self.$parent.is(":hidden")) {
            return;
          }

          if (self.$targetEl.is(":hidden") || self.isVisibilityHidden(self.$targetEl)) {
            self.$targetEl.popover("hide");
            return;
          }

          self.$targetEl.popover("show");
        };

        popovers[self.id] = {
          target: self.$targetEl,
          content: self.$el,
          wrapperSelector: ".popover"
        };

        // Debounce will improve performance on resize
        $(window).resize(_.debounce(adjustPosition, 100));
      },

      // Calculate placement of popover (Bootstrap placement calculations doesn't work as expected)
      calculatePlacement: function (complexPlacement, tip, element) {
        var preferredPlacement = $.trim(complexPlacement.replace(this.autoToken, '')),
            defaultPlacement = "top",
            $element = $(element),
            // To have possibility to get actual size, tip should be displayed           
            $tip = $(tip).appendTo('body').css({ visibility: 'hidden' }),
            tipWidth = $tip.outerWidth(),
            tipHeight = $tip.outerHeight(),
            availableSpace = getSurroundingSpace($element),
            isEnoughSpaceForPreferredPlacement = (preferredPlacement.length>0 && availableSpace[preferredPlacement]>0) ?
              (availableSpace[preferredPlacement] - ((preferredPlacement === 'left' || preferredPlacement === 'right') ? tipWidth : tipHeight)) > 0 :
              false,
            veritcalAutoPlacement,
            horizontalAutoPlacement;

        preferredPlacement = preferredPlacement.length ? preferredPlacement : null;

        // Detach tip from body after getting actual size
        $tip.css({ visibility: 'visible' }).detach();

        if (isEnoughSpaceForPreferredPlacement) {
          return preferredPlacement;
        }

        horizontalAutoPlacement = availableSpace['right'] - tipWidth > 0 ?
          'right' :
          availableSpace['left'] - tipWidth > 0 ?
            'left' :
            null;

        veritcalAutoPlacement = availableSpace['top'] - tipHeight > 0 ?
          'top' :
          availableSpace['bottom'] - tipHeight > 0 ?
            'bottom' :
            null;

        return horizontalAutoPlacement || veritcalAutoPlacement || preferredPlacement || defaultPlacement;
      },
      isVisibilityHidden: function ($target) {
        return $.grep($target.parents().andSelf(), function (el) {
          return $(el).css("visibility") == "hidden";
        }).length > 0;
      }
    });       
  });
})(Sitecore.Speak);

// Get available space around the element relatively to viewport for each direction (top, bottom, left, right)
function getSurroundingSpace(element) {
  var windowWidth = $(window).outerWidth(),
      windowHeight = $(window).outerHeight(),
      elementOffset = $(element).offset(),
      elementHeight = $(element).outerHeight(),
      elementWidth = $(element).outerWidth();

  return {
    top: elementOffset.top,
    bottom: windowHeight + $(window).scrollTop() - (elementOffset.top + elementHeight),
    left: elementOffset.left,
    right: windowWidth + $(window).scrollTop() - (elementOffset.left + elementWidth)
  }
}

var popovers = {};
$(document).on("click", function (e) {
  _.each(popovers, function (popover) {
    if (popover.content.is(":visible") &&
      !$(e.target).is(popover.target) &&
      !$(e.target).is(popover.wrapperSelector)) {

      if (!$(e.target).closest(popover.target).length && !$(e.target).closest(popover.wrapperSelector).length) {
        popover.target.popover("hide");
      }
    }
  });
});