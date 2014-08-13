(function ($) {
﻿  var prototype = $.sc.tabstrip.prototype;

﻿  $.widget("sc.tabstrip", $.extend({ }, prototype, {
﻿    
﻿    _showTab: function (index) {﻿  
      if (this.getIndex() != index) {
        this.element.trigger('activetabchanged', index);
      }
﻿      
﻿      prototype._showTab.apply(this, arguments);
﻿    }
﻿  }));
﻿})(jQuery);

(function ($) {
  $.widget('sc.languageSwitcher', {
    options: {
      targetTabStripId: '',
      tabIndexesToDisplay: [],
      tabIndexesToHide: []
    },

    _create: function () {
      var self = this;
      this.targetTabStrip = $("#" + this.options.targetTabStripId);
      if (!this.targetTabStrip) {
        return;
      }
      
      $(document).on("activetabchanged", "#" + this.options.targetTabStripId, function(event, index) {
         self._initDisplay(index);
      });  
      
      this.refreshDisplay();
    },
    
    _initDisplay: function (tabIndex) {
      if ($.inArray(tabIndex, this.options.tabIndexesToHide) >= 0) {
        $("#" + this.element.attr("id")).hide();
        return;
      }
      
      if ($.inArray(tabIndex, this.options.tabIndexesToDisplay) >= 0) {
        $("#" + this.element.attr("id")).show();
        return;
      }
      
      if (this.options.tabIndexesToHide.length == 0) {
        $("#" + this.element.attr("id")).hide();
        return;
      }
      
      if (this.options.tabIndexesToDisplay.length == 0) {
        $("#" + this.element.attr("id")).show();
        return;
      }
      
      $("#" + this.element.attr("id")).show();
    },
    
    refreshDisplay: function ()
    {
      this._initDisplay(this.targetTabStrip.tabstrip("getIndex"));
    }
  });

})(jQuery);
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}