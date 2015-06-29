define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/String.js"], function (sitecore) {
return {
    priority: 3,
    execute: function (context) {
      postServerRequest("ecm.addlanguage.onlyswitch", { messageId: context.currentContext.messageId, language: context.currentContext.language }, function (response) {
        if (response.error) {
          context.aborted = true;
          return;
        }

        if (response.created) {
          context.currentContext.languageSwitched = true;
        }
      }, false);
    }
  };
});