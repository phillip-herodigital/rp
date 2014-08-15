(function ($) {
﻿  var prototype = $.sc.tabstrip.prototype;

﻿  $.widget("sc.tabstrip", $.extend({ }, prototype, {
﻿    
﻿    _bind: function() {
      var self = this;
﻿      prototype._bind.apply(this, arguments);
﻿      var options = self.options;
﻿      var tabs = self.getTabs();
﻿      if (this.options.hiddenTabs)      
      for (var i = 0; i < this.options.hiddenTabs.length; i++) {
﻿        var index = this.options.hiddenTabs[i];
﻿        if (options.active == index) {
﻿          options.active = -1;
﻿        }

﻿        $(tabs[index]).addClass("ecm-tabstrip-hidden-tabs");
﻿        $(tabs[index]).find('a').hide();
﻿      }

﻿      if (options.active == -1) {
﻿        options.active = self.getFirstVisible();
﻿      }
﻿    }, 
﻿    
﻿    showTab: function (index) {
﻿      if ($.inArray(index, this.options.hiddenTabs)) {
﻿        index = this.getFirstVisible();
﻿      }
﻿      
﻿      prototype._showTab.apply(this, [index]);﻿      
    },
﻿    
﻿    getFirstVisible: function ()
    {
﻿      var self = this;
﻿      var foundIndex = 0;
﻿      var tabs = self.getTabs();
﻿      $.each(tabs, function (index) {
        if (!$(this).hasClass("ecm-tabstrip-hidden-tabs")) {
          foundIndex = index;
          return false;
        }
      });
﻿      
﻿      return foundIndex;
    }
﻿  }));
﻿})(jQuery);