function scKeyDown(evt) {
  evt = window.event;

  if (evt.keyCode == 27) {
    var ctl = scForm.browser.getControl("CancelButton");
    if (ctl != null) {
      ctl.click();
    }
  }
  
  if (evt.keyCode == 13 && evt.srcElement.tagName != "TEXTAREA") {
    var ctl = scForm.browser.getControl("NextButton");
    
    if (ctl != null && window.event.srcElement != ctl) {
      ctl.click();
    }
  }
}

function scWizardInitialize() {
  scForm.browser.attachEvent(document, "onkeydown", scKeyDown);
}

scForm.browser.attachEvent(window, "onload", scWizardInitialize);

scForm.browser.attachEvent(window, "onload", scAlignWizardButtons);

function scAlignWizardButtons() {
  var anothersWizardsButtons = $$('button.scButton', 'button.scButton_Disabled');
  var wizardsMainButtons = $('BackButton', 'NextButton', 'CancelButton');
  wizardsMainButtons.each(function(item) { anothersWizardsButtons = anothersWizardsButtons.without(item); });
  anothersWizardsButtons.each(function(item) { Sitecore.UI.alignButtons(new Array(item)); });
  Sitecore.UI.alignButtons(wizardsMainButtons);
}

function scUpdateWizardControls() {   
  scForm.browser.initializeFixsizeElements(); 

  if (typeof(scTreeview) != 'undefined' && scTreeview.isHidden) {   
    scTreeview.align();
  }  
}   