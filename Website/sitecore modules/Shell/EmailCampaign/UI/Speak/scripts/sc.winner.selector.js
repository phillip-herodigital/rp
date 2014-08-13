(function ($) {
  $.widget('sc.winnerSelector', {
    options: {
      winnerSelectorTabsId: '',
      winnerSelectorHiddenFieldId: '',
      manualWinnerSelectorId: '',
      wouldYouLikeToChooseTheVariantAsWinnerNow: ''
    },

    _create: function () {
      options = this.options;
      this.addEvents();
    },

    addEvents: function () {
      var self = this;

      self.element.find('#' + self.options.winnerSelectorTabsId + ' a').on('click', function () {
        var selectedIndex = $(this).parent().index();
        self.element.find('#' + self.options.winnerSelectorHiddenFieldId).attr('value', selectedIndex);
      });

      self.element.find("input[type='button']").live('click', function () {
        if (!confirm(self.options.wouldYouLikeToChooseTheVariantAsWinnerNow)) {
          return;
        }

        var selectedId = $(this).parentsUntil('tr').parent().attr('id');
        var target = $(this).parentsUntil('[name]').parent();

        $.netajax(target, 'chooseAsWinner' + '|' + selectedId, true);
      });
    },

    destroy: function () {
      return $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);