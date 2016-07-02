function initActionControl(contextApp, messageContext) {
  if (!contextApp || !messageContext) {
    return;
  }

  contextApp.MessageContext.on("change:isBusy", setActionControlsEnabled([
    '34BE63852A2C4AC6BB3A9F35C3280564' // Edit engagement plan
  ]));

  // Enables or disables a set of actions according to the MessageContext.isReadonly attribute.
  function setActionControlsEnabled(actionIds) {
    contextApp.MessageContext.on("change:isReadonly", function () {

      // Only react on the event if MessageContext is not busy loading.
      if (contextApp.MessageContext.get("isBusy") === false) {
        var isReadOnly = contextApp.MessageContext.get("isReadonly");

        $.each(actionIds, function (actionIdIndex, actionId) {
          $.each(contextApp.ActionControl.get("actions"), function (actionIndex, action) {
            if (action.id() === actionId) {
              if (isReadOnly === false) {
                action.enable();
              } else {
                action.disable();
              }

              return false;
            }

            return true;
          });
        });
      }
    });
  }
}



