if (scForm.browser.isWebkit) {
  scForm.browser.attachEvent(window.top, "onbeforeunload", scBeforeUnload);
}
else {
  scForm.browser.attachEvent(window, "onbeforeunload", scBeforeUnload);
}

function scBeforeUnload() {
  if (scForm.modified) {
    if (scForm.browser.isWebkit) {
      return scForm.translate("There are unsaved changes.");
    }

    window.event.returnValue = scForm.translate("There are unsaved changes.");    
  }
}
