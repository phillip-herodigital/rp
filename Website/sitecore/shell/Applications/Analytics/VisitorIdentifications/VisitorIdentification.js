function scSetSlider(id, value) {
  var ctl = $("texts_" + id);
  
  $A(ctl.childElements()).each(function(e) {e.hide()});

  ctl = $(id + "_value" + value).show();

  scUpdatePreview();
}

function scUpdatePreview() {
  var visitor = parseInt($F("visitor"), 10);

  if (visitor == 0) {
    $("PreviewOverridden").hide();

    var business = $("business");
    if(business)
    {  var v = parseInt($F("business"), 10);
       if (v > visitor) { visitor = v;
      }
    }

    var ip = $("ip");

if(ip)
{
    v = parseInt($F("ip"), 10);
    if (v > visitor) {
      visitor = v;
    }}

var useragent = $("useragent");

if(useragent)
{
    v = parseInt($F("useragent"), 10);
    if (v > visitor) {
      visitor = v;
    }
}

var vis = $("visitor");

if(vis)
{

    v = parseInt($F("visitor"), 10);
    if (v > visitor) {
      visitor = v;
    }
}
  }
  else {
    $("PreviewOverridden").show();
  }

  var e = $("business_value" + visitor);

  $("PreviewName").innerHTML = e.down().innerHTML;
  $("PreviewDescription").innerHTML = e.down().next().innerHTML;
}

document.observe("dom:loaded", function() {
  scUpdatePreview();
});

