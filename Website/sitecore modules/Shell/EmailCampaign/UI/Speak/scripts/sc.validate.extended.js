(function ($) {
﻿  var prototype = $.sc.validate.prototype;

﻿  $.widget("sc.validate", $.extend({ }, prototype, {
﻿    
﻿    displayValidation: function () {
﻿      var self = this;
﻿      self.validate('validate', null, { 'error': self.rules['error'], 'warning': self.rules['warning'], 'information': self.rules['information']});
﻿    }
﻿  }));
﻿})(jQuery);