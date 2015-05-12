module("Utility methods test")
test("Cookie manipulations", 2, function() {
  var cookieName = "testcookie", cookieValue = "test-value";  
  Sitecore.PageModes.Utility.setCookie(cookieName, cookieValue);
  same(Sitecore.PageModes.Utility.getCookie(cookieName), cookieValue, "Cookie values must match");
  Sitecore.PageModes.Utility.removeCookie(cookieName);
  ok (!Sitecore.PageModes.Utility.getCookie(cookieName), "The cookie should be removed"); 
});

test("Parsing palette response for rendering", 5, function() {
  var testLayout = "{" + 
  "\"?xml\": {" + 
  "\"@version\": \"1.0\"," + 
  "\"@encoding\": \"utf-16\"" + 
  "}," + 
  "\"r\": {" +
    "\"@xmlns:xsi\": \"http://www.w3.org/2001/XMLSchema-instance\"," + 
    "\"@xmlns:xsd\": \"http://www.w3.org/2001/XMLSchema\"," + 
    "\"d\": [" +      
      "{" + 
        "\"@id\": \"{46D2F427-4CE5-4E1F-BA10-EF3636F43534}\"," + 
        "\"@l\": \"{14030E9F-CE92-49C6-AD87-7D49B50E42EA}\"," + 
        "\"r\": {" + 
          "\"@ds\": \"\"," + 
          "\"@id\": \"{493B3A83-0FA7-4484-8FC9-4680991CF743}\"," + 
          "\"@par\": \"\"," + 
          "\"@ph\": \"content\"," + 
          "\"@uid\": \"{A08C9132-DBD1-474F-A2CA-6CA26A4AA650}\"" + 
        "}" +
      "}" +
    "]" +
  "}" +
"}";

var testRenderingHTML = 
"<code type='text/sitecore' chromeType='rendering' kind='open' hintName='Sample Rendering' id='r_B343725A3A93446EA9C83A2CBD3DB489' class='scpm' data-selectable='true'>" + 
"{\"commands\":[{\"click\":\"chrome:rendering:sort\",\"header\":\"Change position\",\"icon\":\"/sitecore/shell/themes/standard/Custom/16x16/move_pageeditor.png\",\"disabledIcon\":\"/temp/move_pageeditor_disabled16x16.png\",\"isDivider\":false,\"tooltip\":\"Change position.\",\"type\":\"\"}],\"custom\":{\"renderingID\":\"493B3A830FA744848FC94680991CF743\",\"editable\":\"true\"},\"displayName\":\"Sample Rendering\"}" +
"</code>" + 
"<div>I am rendering</div>" + 
"<code type='text/sitecore' chromeType='rendering' kind='close' hintName='Sample Rendering' class='scpm'></code>";
  
var response = 
"<form name=\"scPaletteForm\" method=\"post\" action=\"/sitecore/shell/Applications/WebEdit/Palette.aspx\" id=\"scPaletteForm\">" + 
"<script type='text/javascript' src='/test.js' ></script>" +
"<link href='/default.css' rel='stylesheet' /> " + 
"<div>" + 
"<input type=\"hidden\" name=\"__VIEWSTATE\" id=\"__VIEWSTATE\" value=\"/wEPDwUKMTQyMjI2ODI1OWRkgwepiKNi/m81dXV0YL/d0+wwX9Y=\" />" + 
"</div>" + 
"<span id=\"scLayoutDefinitionHolder\">" +
  testLayout + 
"</span>" + 
"<div id=\"scHTMLHolder\">" + 
   testRenderingHTML +    
 "</div>" + 
"</form>";
 
  var result = Sitecore.PageModes.Utility.parsePalleteResponse(response);
  same(result.layout.toLowerCase(), testLayout.toLowerCase(), "layouts must match");
  same(result.html.toLowerCase(), $sc("<div>" + testRenderingHTML + "</div>").html().toLowerCase(), "rendering html must match");
  same(result.scripts.length, 1, "The scripts are missing");
  same(result.styleSheets.length, 1, "The styleshhets are missing");
  ok(!result.url, "url must be present only for sublayouts")
});

test("Parsing palette response for sublayout", 5, function() {
  var testLayout = "{" + 
  "\"?xml\": {" + 
  "\"@version\": \"1.0\"," + 
  "\"@encoding\": \"utf-16\"" + 
  "}," + 
  "\"r\": {" +
    "\"@xmlns:xsi\": \"http://www.w3.org/2001/XMLSchema-instance\"," + 
    "\"@xmlns:xsd\": \"http://www.w3.org/2001/XMLSchema\"," + 
    "\"d\": [" +      
      "{" + 
        "\"@id\": \"{46D2F427-4CE5-4E1F-BA10-EF3636F43534}\"," + 
        "\"@l\": \"{14030E9F-CE92-49C6-AD87-7D49B50E42EA}\"," + 
        "\"r\": {" + 
          "\"@ds\": \"\"," + 
          "\"@id\": \"{493B3A83-0FA7-4484-8FC9-4680991CF743}\"," + 
          "\"@par\": \"\"," + 
          "\"@ph\": \"content\"," + 
          "\"@uid\": \"{A08C9132-DBD1-474F-A2CA-6CA26A4AA650}\"" + 
        "}" +
      "}" +
    "]" +
  "}" +
"}";

var response = 
"<form name=\"scPaletteForm\" method=\"post\" action=\"/sitecore/shell/Applications/WebEdit/Palette.aspx\" id=\"scPaletteForm\">" + 
"<div>" + 
"<input type=\"hidden\" name=\"__VIEWSTATE\" id=\"__VIEWSTATE\" value=\"/wEPDwUKMTQyMjI2ODI1OWRkgwepiKNi/m81dXV0YL/d0+wwX9Y=\" />" + 
"</div>" + 
"<span id=\"scLayoutDefinitionHolder\">" +
  testLayout + 
"</span>" +
"<span id='scUrlHolder'>" + 
 "http://localhost/Samplegggg.aspx?sc_de=SC_PD_D2FED51CD75847849C1D62ECCBAFD1F3&sc_phk=%2fmain%2fcentercolumn&sc_co=0&sc_ruid=CF044AD90332407AABDE587214A2C808&sc_pa=%7bEB443C0B-F923-409E-85F3-E7893C8C30C2%7d" + 
"</span>" + 
"</form>";

  var result = Sitecore.PageModes.Utility.parsePalleteResponse(response);
  same(result.layout.toLowerCase(), testLayout.toLowerCase(), "layouts must match");
  ok(!result.html, "rendering html mustn't be present for sublayouts");
  same(result.scripts.length, 0, "The scripts shouldn't be present");
  same(result.styleSheets.length, 0, "The styleshhets shouldn't be present");
  ok(result.url, "url must be present")
});

test("Adding style scripts", 2, function() {
  var scriptSrc = window.location.protocol + "//" + window.location.host + "/new_file.js";
  var scripts= [scriptSrc];
  var scriptsCount = $sc("script").length;
  Sitecore.PageModes.Utility.tryAddScripts(scripts);
  var scriptAdded = $sc("script[src='" + scriptSrc + "']").length === 1;
  ok(scriptAdded, "The script wasn't added");
  
  Sitecore.PageModes.Utility.tryAddScripts(scripts);
  same(scriptsCount + 1, $sc("script").length, "The same script shouldn't be added twice");   
});

test("Adding style sheets", 2, function() {
  var linkHref = window.location.protocol + "//" + window.location.host + "/new_file.css";
  var styleSheets= [linkHref];
  var styleSheetsCount = $sc("link[rel='stylesheet']").length;
  Sitecore.PageModes.Utility.tryAddStyleSheets(styleSheets);
  var styleSheetAdded = $sc("link[rel='stylesheet'][href='" + linkHref + "']").length === 1;
  ok(styleSheetAdded, "The stylesheet wasn't added");
  
  Sitecore.PageModes.Utility.tryAddStyleSheets(styleSheets);
  same(styleSheetsCount + 1, $sc("link[rel='stylesheet']").length, "The same stylesheet shouldn't be added twice");
});