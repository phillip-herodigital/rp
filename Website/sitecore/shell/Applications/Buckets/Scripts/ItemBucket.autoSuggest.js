/********** Auto Suggest  *******/


function autoSuggestWithWait(element, filterName, serviceName, data, characterCount) {
  var a = $j("#ui_element");
  if (a.find(".addition").val().toLowerCase().indexOf(filterName + ":") > -1) {
    if (element.value.toLowerCase().replace(new RegExp('(' + filterName + ":" + ')', 'gi'), "").length >= characterCount) {
      jQuery.ajax({
        type: "POST",
        url: "/sitecore/shell/Applications/Buckets/" + serviceName,
        data: data,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (a) {
          var b = a.d;
          b = b.toString().split(",");
          var c = [];
          $j.each(b, function () { c.push(filterName + ":" + this); });
          $j(".addition").autocomplete({
            open: function (event, ui) {
              $j(".ui-autocomplete").css("margin-top", "8px").css("left", $j(".addition").offset().left).css("width", "100%").css('margin-left', '-34px');
              $j(".ui-menu-item").css("height", "28px");
              $j(".ui-corner-all").css("text-indent", "20px").css("font-size", "15px");
            },
            source: c,
            autoFocus: true
          });
      
        }
      });
    }
  }
}

function autoSuggestSlider(filterName, parameters) {

  /********** Parameters set through Items in Content Tree  *******/

  var a      = $j("#ui_element");
  var min    = 0;
  var max    = 99999999;
  var value  = 99999999;
  var range  = "false";
  var values = [0, 0];
  var start  = 0;
  var step   = 1;
  var end    = 0;

  /****************************************************************/
  //TODO: Language Problem
  if (parameters != "") {
    min         = getGloablQueryVariable("min", parameters);
    max         = getGloablQueryVariable("max", parameters);
    range       = getGloablQueryVariable("range", parameters);
    value       = getGloablQueryVariable("value", parameters);
    start       = getGloablQueryVariable("start", parameters);
    end         = getGloablQueryVariable("end", parameters);
    step        = getGloablQueryVariable("step", parameters);
    values      = [parseInt(start, 10), parseInt(end, 10)];
  }

  if (a.find(".addition").val().indexOf(filterName + ":") > -1) {
    a.find("#slider").slider({
      min: min,
      animate: true,
      step: parseInt(step, 10),
      max: max,
      values: values,
      value: value,
      range: range,
      stop: function (event, ui) {
        if (range == "true") {
          a.find(".addition").val(filterName + ":[" + ui.values[0].toString() + ' TO ' + ui.values[1].toString() + ']');
        } else {
          a.find(".addition").val(filterName + ":" + ui.value.toString());
        }
      }
    });
  }
}

function autoSuggest(filterName, serviceName, data) {
  var a = $j("#ui_element");
  if (a.find(".addition").val().toLowerCase().indexOf(filterName + ":") > -1) {
    jQuery.ajax({
      type: "POST",
      url: "/sitecore/shell/Applications/Buckets/" + serviceName,
      data: "{" + data + "}",
      cache: false,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (a) {
        var b = a.d;
        b = b.toString().split(",");
        var c = [];
        $j.each(b, function () { c.push(filterName + ":" + this); });
        $j(".addition").autocomplete({
          open: function (event, ui) {
            $j(".ui-autocomplete").css("margin-top", "8px").css("left", $j(".addition").offset().left).css("width", "100%").css('margin-left', '-34px');
            $j(".ui-menu-item").css("height", "28px");
            $j(".ui-corner-all").css("text-indent", "20px").css("font-size", "15px");
          },
          source: c,
          autoFocus: true
        });
      }
    });
    //$j(".addition").autocomplete("destroy");
  }
}

function autoSuggestDate(filterName, parameters) {
  var defaultDate    = null;
  var maxDate        = null;
  var minDate        = null;
  var numberOfMonths = 1;
  var stepMonthsType = 1;
  //TODO: Language Problem
  if (parameters != "") {
    defaultDate = getGloablQueryVariable("defaultDate", parameters);
    if (getGloablQueryVariable("maxDate", parameters) != "") {
      maxDate = getGloablQueryVariable("maxDate", parameters);
    }

    if (getGloablQueryVariable("minDate", parameters) != "") {
      minDate = getGloablQueryVariable("minDate", parameters);
    }

    if (getGloablQueryVariable("numberOfMonths", parameters) != "") {
      numberOfMonths = getGloablQueryVariable("numberOfMonths", parameters);
    }

    if (getGloablQueryVariable("stepMonthsType", parameters) != "") {
      stepMonthsType = getGloablQueryVariable("stepMonthsType", parameters);
    }
  }

  //TODO: Rework
  var a = $j("#ui_element");
  if (a.find(".addition").val().toLowerCase().indexOf(filterName + ":") > -1) {
    if ((CurrentCulture.indexOf("en") > 0) || CurrentCulture == "en") {
      a.find(".addition").datepicker("option", $j.datepicker.regional["en-AU"]);
      $j.datepicker.setDefaults($j.datepicker.regional["en-AU"]);
    } else {
      a.find(".addition").datepicker("option", $j.datepicker.regional[CurrentCulture]);
      $j.datepicker.setDefaults($j.datepicker.regional[CurrentCulture]);
    }

    a.find(".addition").datepicker({
      defaultDate: defaultDate,
      numberOfMonths: parseInt(numberOfMonths, 10),
      minDate: minDate,
      maxDate: maxDate,
      stepMonthsType: parseInt(stepMonthsType, 10),
      beforeShow: function (input, list) {
        $j(".ui-datepicker").css("top", "77px").css("left", $j(".addition").offset().left).css("width", "378px").css('margin-left', '-34px');
      },
      onClose: function (b) {
        var d = a.find(".addition").val().toLowerCase().replace(new RegExp('(' + filterName + ":" + ')', 'gi'), "").replace(b, "");
        a.find(".addition").val(d);
        if (b.replace(new RegExp('(' + filterName + ":" + ')', 'gi'), "") == "") {
          var text = new Date().toString($j.datepicker.regional[CurrentCulture].dateFormat.replace(new RegExp('m', 'gi'), 'M'));
          var image = filterName;
        } else {
          text = b;
          image = urlExists('images/' + filterName + '.png') ? filterName : 'text';
        }

        a.find(".boxme").prepend('<li class="token-input-token-facebook" title="' + text + '"><span title="Change Search Logic" style="background: url(\'images/' + image + '.png\') no-repeat center center;padding: 0px 11px;" class="booleanOperation"></span><span>' + upperFirstLetter(filterName) + ' Date:</span><span style="text-overflow: ellipsis;color:black;max-width: 411px;overflow: hidden;vertical-align:top;" class="' + filterName + ' type">' + text + '</span><p class="' + filterName + 'hidden" style="display:none">' + text + '</p><span class="token-input-delete-token-facebook remove" title="Remove Search Term">×</span></li>');

        $j(".remove").live("click", function () {
          $j(this).parents("li:first").remove();
          a.find(".addition").focus();
        });
        try {
          a.find(".addition").datepicker("destroy");
        } catch(e) {} 
      }
    });

    a.find(".token-input-token-facebook").bind("dblclick", function () {
      var b  = $j(this).find(".type");
      var cc = b.html();
      var dd = b.attr("class").split(/\s+/)[0];

      if (a.find(".addition").val().indexOf(dd + ":" + cc) < 0) {
        a.find(".addition").val(a.find(".addition").val() + (dd + ":" + cc));
        $j(this).parents("li:first").remove();
      }
    });
    a.find(".addition").datepicker("show");
    $j(".addition").bind("datepickercreate", function () { $j(this).show(); });
  }
}

function autoSuggestText(element, filterName, data, characterCount) {
  var a            = $j("#ui_element");
  var textBoxValue = a.find(".addition").val().toLowerCase();
  //TODO: Hardcoded Values
  if (/(template:|location:|extension:|version:|debug:|id:|ref:|custom:|sort:|site:|author:|language:|text:|tag:|start:|end:|recent:)/i.test(textBoxValue)) {
    // Why is it empty?
  } else {
    if (a.find(".addition").val().indexOf(filterName) > -1) {
      if (element.val().length >= characterCount) {
        jQuery.ajax({
          type: "POST",
          url: "/sitecore/shell/Applications/Buckets/ItemBucket.asmx/GetNames",
          data: data,
          cache: false,
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(a) {
            var b = a.d;
            b = b.toString().split(",");
            var c = [];
            $j.each(b, function() { c.push(this.toString()); });
            $j(".addition").autocomplete({
              open: function(event, ui) {
                $j(".ui-autocomplete").css("margin-top", "8px").css("left", $j(".addition").offset().left).css("width", "100%").css('margin-left', '-34px');
                $j(".ui-menu-item").css("height", "28px");
                $j(".ui-corner-all").css("text-indent", "20px").css("font-size", "15px");
              },
              source: c,
              autoFocus: true
            });

            $j(".addition").autocomplete("show");
            $j("#token-input-demo-input-local").show();
          }
        });
      }
    }
  }
}
