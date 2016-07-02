define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/String.js"], function (sitecore) {
  return {
    priority: 4,
    execute: function (context) {
      postServerRequest("EXM/MessageUrl", { value: context.messageId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          context.aborted = true;
          return;
        }

        if (!response.value) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CanNotOpenNewMessage"));
          context.aborted = true;
          return;
        }

        window.parent.location.replace(response.value);
      }, false);
    }
  };
});