define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.MyItems =
  {
    canExecute: function (context) {
      var amountOfLockedItems = context.app.canExecute("ExperienceEditor.MyItems.Count", context.currentContext);
      var myItemsButton = $("a[data-sc-id='MyItemsRibbonButton'] span");
      var counterSpan = "<span> (" + amountOfLockedItems + ")</span>";

      if (amountOfLockedItems == 0) {
        myItemsButton.children().remove();
      } else {
        if (myItemsButton.children().length == 0)
          myItemsButton.append(counterSpan);
        else
          myItemsButton.children().html(counterSpan);
      }
      return true;
    },

    execute: function (context) {
      var dialogPath = "/sitecore/shell/~/xaml/Sitecore.Shell.Applications.WebEdit.Dialogs.LockedItems.aspx";
      var dialogFeatures = "dialogHeight: 600px;dialogWidth: 800px;";
      Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function () {
        Sitecore.Commands.MyItems.canExecute(context);
        context.currentContext.isLocked = context.app.canExecute("ExperienceEditor.MyItems.Count", context.currentContext);
        Sitecore.Commands.Lock.canExecute(context);
      });
    }
  };
});