(function ($)
{
  window.PreviewUpdater = new function ()
  {
    this.updateWithDelay = function (parentId, controlId, callback)
    {
      var self = this;
      setTimeout(function () { self.performUpdate(parentId, controlId, callback); }, 20000);
    };

    this.clearRefresher = function (key, mode, callback)
    {
      if (supportsStorage())
      {
        localStorage.removeItem(key + mode);
      }

      if (callback)
      {
        callback();
      }
    };

    this.startRefresher = function (parentId, controlId, key, mode, callback)
    {
      if (supportsStorage())
      {
        if (localStorage.getItem(key + mode) == "processing")
        {
          return;
        }

        localStorage.setItem(key + mode, "processing");
        this.performUpdate(parentId, controlId, callback);
      }
    };

    this.checkRefresher = function (parentId, controlId, key, mode, callback)
    {
      if (supportsStorage())
      {
        if (localStorage.getItem(key + mode) == "processing")
        {
          this.performUpdate(parentId, controlId, callback);
        }
      }
    };

    this.openAccordions = function (parentId, callback)
    {
      setTimeout(function ()
      {
        $('#' + parentId + ' a.more-info').each(function ()
        {
          $(this).triggerHandler('click');
        });
        if (callback)
        {
          callback();
        }
      }, 5000);
    };

    this.performUpdate = function (parentId, controlId, callback)
    {
      var self = this;
      var $inSacButton = $("#" + controlId);

      if ($('form').length < 2 && ($('.spinner-inline').length < 1 || callback != null))
      {
        $.netajax($inSacButton, null, true);
        $(document).ready(function ()
        {
          self.openAccordions(parentId, callback);
        });
      } else
      {
        self.updateWithDelay(parentId, controlId, callback);
      }
    };

    var supportsStorage = function ()
    {
      try
      {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e)
      {
        return false;
      }
    };
  }; 
})(jQuery);

$(function () {
    resizeReportDdlHeight(40);
});
/*386935*/
function resizeReportDdlHeight(legendHeight) {
    var container = $('fieldset[id*="ReportsDropList"]');
    if (container.length == 0) {
        setTimeout(function () { resizeReportDdlHeight(legendHeight); }, 200);
    } else {
        var obj = container.find('.ui-jqgrid-bdiv');
        obj.css('height', (parseInt(obj.height()) - legendHeight) + 'px');
        return obj;
    }
}
/*389041*/
function scrollToAddedVariant(addedId) {
    setTimeout(function () {
        var obj = $('iframe[src*="' + addedId + '"]');
        var fieldset = obj.parent().parent().parent().parent().parent().parent().parent().parent().parent();
        if (fieldset.hasClass('collapsed')) {
            fieldset.children('legend').click();
        }
        var subjectInput = obj.parent().parent().parent().siblings(':first').find('input[id*="replaceTokensInput_"]');
        var docTop = $(document).scrollTop();
        var top = subjectInput.offset().top;
        $('html,body').animate({ scrollTop: top - 80 }, (top - docTop)/2);
        setTimeout(function () { subjectInput.focus(); }, 800);
    }, 1000);
}
/*390360*/
//obsolete - moved to sc.dispatch.js
function SelectableValueFromDdl(ddlId, hfId) {
    var ddl = $('#' + ddlId);
    var hf = $('#' + hfId);

    function init() {
        setSelectedValueFromDdl();
        ddl.change(function () {
            setSelectedValueFromDdl();
        });
    }

    function setSelectedValueFromDdl() {
        var ttt = ddl.find('option:selected').val();
        hf.val(ttt);
    }

    init();
}
