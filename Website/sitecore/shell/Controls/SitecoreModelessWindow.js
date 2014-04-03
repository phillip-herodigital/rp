scModelessWindow = new function() {
  this.postDialogResult = function() {
    this.calleeForm.postResult(window.returnValue, this.calleePipeline);
  };

  var dialogArgs = window.dialogArguments;
  if (!dialogArgs) {
    return;
  }

  var calleeForm = dialogArgs.scCalleeForm;
  if (!calleeForm) {
    return;
  }

  this.calleeForm = calleeForm;
  var calleePipeline = dialogArgs.scCalleePipeline;
  if (!calleePipeline) {
    return;
  }
  
  this.calleePipeline = calleePipeline;
  var openerWindow = dialogArgs.openerWindow;
  if (!openerWindow) {
    return;
  }

  this.openerWindow = openerWindow;
  scForm.browser.attachEvent(window, "onbeforeunload", function() {
    scModelessWindow.postDialogResult();
    calleeForm.browser.removeChild(openerWindow.document.getElementById('ModalOverlay'));
  });
};