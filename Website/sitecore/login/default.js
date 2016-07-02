if (window.top.frames.length > 0) {
  window.top.location = window.location;
}

function scTestBrowser() {
  return true;

  var agt = navigator.userAgent.toLowerCase();

  var is_major = parseInt(navigator.appVersion);
  var is_minor = parseFloat(navigator.appVersion);

  var is_ie     = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
  var is_ie3    = (is_ie && (is_major < 4));
  var is_ie4    = (is_ie && (is_major == 4) && (agt.indexOf("msie 4")!=-1) );
  var is_ie4up  = (is_ie && (is_major >= 4));
  var is_ie5    = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.0")!=-1) );
  var is_ie5_5  = (is_ie && (is_major == 4) && (agt.indexOf("msie 5.5") !=-1));
  var is_ie5up  = (is_ie && !is_ie3 && !is_ie4);
  var is_ie5_5up =(is_ie && !is_ie3 && !is_ie4 && !is_ie5);
  var is_ie6    = (is_ie && (is_major == 4) && (agt.indexOf("msie 6.")!=-1) );
  var is_ie6up  = (is_ie && !is_ie3 && !is_ie4 && !is_ie5 && !is_ie5_5);
  
  if (!is_ie6up) {
    alert("Your are currently using " + navigator.userAgent + " (" + is_major + "." + is_minor + ") as your browser.\n\n" +
      "The Sitecore client requires Internet Explorer 6.0 or later.\n\n" +
      "You will probably not be able to run the Sitecore client.");
    return false;
  }
  
  return true;
}

function onLoad() {
  scTestBrowser();
  
  var ctl = document.getElementById("Login_UserName");
  if (ctl != null) {
    if (ctl.value != "") {
      ctl = document.getElementById("Login_Password");
    }
    try {
      ctl.focus();
    }
    catch(e) {
    }
  }
}

function onDblClick() {
  var form = document.getElementById("Login_Login");  
  form.click();
}

function onClick(option, startUrl) {
  var panel = document.getElementById("AdvancedOptions");

  var elements = panel.getElementsByTagName("BUTTON");
  
  for(var n = 0; n < elements.length; n++) {
    var element = elements[n];
    
    if (element.id.indexOf(option) >= 0) {
      element.className = "OptionBoxOptionsActive";
    }
    else if (element.className == "OptionBoxOptionsActive") {
      element.className = "";
    }
  }

  var element = document.getElementById("AdvancedOptionsStartUrl");
  element.value = startUrl;
}

function scToggleOptions() {
  var e = document.getElementById('OptionBox');
  
  var isHidden = e.style.display == "none";
  
  e.style.display = isHidden ? "" : "none";

  var element = document.getElementById("ActiveTab");
  element.value = isHidden ? "advanced" : "";

  return false;
}
