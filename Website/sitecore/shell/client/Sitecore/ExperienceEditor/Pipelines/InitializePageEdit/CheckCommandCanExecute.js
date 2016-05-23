define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  return {
    priority: 1,
    execute: function (context) {
      ExperienceEditor.CommandsUtil.runCommandsCollectionCanExecute(context.commands, function (stripId) {
        var cookieValue = ExperienceEditor.Common.getCookieValue("sitecore_webedit_activestrip");
        if (cookieValue === "") {
          return false;
        }

        return stripId && stripId + "_ribbon_tab" !== cookieValue;
      }, false);
    }
  };
});