define(["jquery"], function (jQuery) {
  /*
  *  Based on:
  *﻿    Plugin name : jquery.webservice
  *﻿    Author : Jimmy Hattori
  *﻿    Created on : 2009-06-11
  *﻿    Description : Enable to access .Net webservice.
  */

  jQuery.hardrockwebservice = function (options) {
    try {

      var settings = {
        requestType: "soap1.1",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          throw XMLHttpRequest.responseText;
        }
      };
      
      $.extend(settings, options);

      var oBuffer = new Array();

      settings.nameSpace += (settings.nameSpace.length - 1 == settings.nameSpace.lastIndexOf("/")) ? "" : "/";

      settings.requestType = "soap1.1";
      settings.methodType = "POST";
      settings.contentType = "text/xml";

      oBuffer.push("<soap:Envelope ");
      oBuffer.push("xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">");
      oBuffer.push("<soap:Body>");
      oBuffer.push("<" + settings.methodName + " xmlns=\"" + settings.nameSpace + "\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">");
      oBuffer.push("<typeName>" + settings.data.typeName + "</typeName>");
      oBuffer.push("<parameters>");

      for (key in settings.data.parameters) {
        oBuffer.push("<anyType i:type=\"a:string\" xmlns:a=\"http://www.w3.org/2001/XMLSchema\">" + settings.data.parameters[key] + "</anyType>");
      }

      oBuffer.push("</parameters>");
      oBuffer.push("<credentials><Password>" + settings.data.password + "</Password><UserName>" + settings.data.userName + "</UserName></credentials>");
      oBuffer.push("</" + settings.methodName + ">");
      oBuffer.push("</soap:Body>");
      oBuffer.push("</soap:Envelope>");

      settings.requestData = oBuffer.join("");

      $.ajax({
        type: settings.methodType,
        cache: false,
        url: settings.url,
        data: settings.requestData,
        contentType: settings.contentType,
        dataType: settings.dataType,
        parseData: false,
        success: settings.success,
        error: settings.error,
        beforeSend: function (XMLHttpRequest) {
          if (settings.requestType == "soap1.1" || settings.requestType == "soap1.2") {
            XMLHttpRequest.setRequestHeader("SOAPAction", settings.nameSpace + settings.methodName);
          }
          // XMLHttpRequest.setRequestHeader("Content-Length", settings.requestData.length);
          // XMLHttpRequest.setRequestHeader("Connection", "close");
        }
      });
    } catch (err) {
      alert("Error occurred in jquery.hardrockwebservice.js: " + err);
    }
  };
});