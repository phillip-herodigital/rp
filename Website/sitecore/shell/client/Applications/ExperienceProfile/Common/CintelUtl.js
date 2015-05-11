define(["sitecore"], function (sc)
{
  var textProperty = "text";

  return {
    getQueryParam: function (paramName)
    {
      var paramValue = sc.Helpers.url.getQueryParameters(window.location.href)[paramName];
      return paramValue || "";
    },

    setText: function (control, text, allowEmpty)
    {
      if (allowEmpty || text)
      {
        control.set(textProperty, text);
      }
    },
    
    getFullName: function(data)
    {
      if(!data) return "";

      var fullName = data.firstName;
      data.middleName ? fullName += " " + data.middleName : $.noop();
      data.surName ? fullName += " " + data.surName : $.noop();
      return fullName;
    },
    
    getFullTelephone: function(data)
    {
      if(!data) return "";

      var fullTelephone = "";
      data.countryCode ? fullTelephone += data.countryCode : $.noop();
      data.extension ? fullTelephone += " (" + data.extension + ")" : $.noop();
      fullTelephone += " " + data.number;
      return fullTelephone;
    }
  };
});