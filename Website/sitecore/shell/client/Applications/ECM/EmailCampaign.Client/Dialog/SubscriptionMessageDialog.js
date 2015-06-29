define(["sitecore"], function (sitecore) {
  return _sc.Definitions.App.extend({
    initialized: function () {
      sitecore.on("subscription:message:dialog:show", this.showDialog, this);

      sitecore.on("create:message:click", function (eventInfo) {
        if (!eventInfo || !eventInfo.url) {
          return;
        }
        
        sessionStorage.createMessageParameters = JSON.stringify(eventInfo.parameters);
        window.location = eventInfo.url;
      });

    },
    showDialog: function (createMessageDialogDataSource) {
      if (!createMessageDialogDataSource || createMessageDialogDataSource.createMessageOptions.get("createMessageOptions").length < 1) {
        return;
      }
      var contextApp = this;
      contextApp.CreateMessage.set("dataSourceValue", createMessageDialogDataSource.createMessageOptions.get("createMessageOptions"));
      contextApp.CreateMessage.viewModel.renderDataSource();
      this.SubscriptionMessageDialog.show();
    }
    
  });
});
