/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
define(["sitecore", "/-/speak/v1/ecm/MessageCreationDialogBase.js"], function (sitecore, messageCreationBase) {
  return messageCreationBase.extend({
    showEvent: "subscription:message:dialog:show",
    dialogName: "SubscriptionMessageDialog"
  });
});