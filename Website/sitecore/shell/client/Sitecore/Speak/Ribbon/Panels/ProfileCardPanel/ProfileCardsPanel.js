var basePath = "/-/speak/v1/ExperienceEditor/";
define(
    [
        basePath + "ProfileCards.js",
        basePath + "SelectProfileCard.js"
    ]
);
var ProfileCardsPanel = {
  selectProfileCard: function (profileCardId) {
    var clientContext = this.resolveClientContext();

    if (!clientContext || !clientContext.instance) {
      return;
    }

    clientContext.instance.executeCommand("SelectProfileCard", profileCardId);

    clientContext.Common.closeFullContentIframe();
  },

  editProfileCards: function () {
    var clientContext = this.resolveClientContext();

    if (!clientContext || !clientContext.instance) {
      return;
    }

    clientContext.instance.executeCommand("ProfileCards");

    clientContext.Common.closeFullContentIframe();
  },

  resolveClientContext: function () {
    var clientContext = window.top.ExperienceEditor;

    return clientContext;
  }
}