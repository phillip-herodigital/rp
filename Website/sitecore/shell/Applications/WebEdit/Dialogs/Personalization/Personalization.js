if (typeof(Sitecore) == "undefined") {
  Sitecore = {};
}

  Sitecore.CollapsiblePanel.addNew = function(id) {        
    scCreateSortable();
    this.editName(id);    
  };
    
  Sitecore.CollapsiblePanel.getPreviousRule = function(ruleContainer) {
    var $ruleContainer = $(ruleContainer);
    var previous = $ruleContainer.previous(".rule-container");
    return previous;     
  };

  Sitecore.CollapsiblePanel.getNextRule = function(ruleContainer) {
    var $ruleContainer = $(ruleContainer);
    var next = $ruleContainer.next(".rule-container");
    return next;
  };
  
  Sitecore.CollapsiblePanel.moveDown = function(element, evt, id) {        
      var currentRule = $(id);
      var nextRule = this.getNextRule(currentRule);
      if (nextRule) {        
        scForm.postRequest("","","","MoveConditionAfter(\"" + id + "\",\"" + nextRule.id + "\")", null, true); 
        nextRule.insert({after: currentRule});
      }    
  };

  Sitecore.CollapsiblePanel.moveUp = function(element, evt, id) {        
      var currentRule = $(id);
      var prevRule = this.getPreviousRule(currentRule);
      if (prevRule) {        
        scForm.postRequest("","","","MoveConditionBefore(\"" + id + "\",\"" + prevRule.id + "\")", null, true); 
        prevRule.insert({before: currentRule});
      }      
  };

  Sitecore.CollapsiblePanel.remove = function(element, evt, id) {    
    scForm.invoke("DeleteRuleClick", id);        
  };
  
  Sitecore.CollapsiblePanel.renameAction = function(id) {
    this.editName(id);
  };

  Sitecore.CollapsiblePanel.renameComplete = function (element, evt) {    
    var nameEdit = $(element);
    if (!nameEdit) {
      return;
    }
    
    var value = nameEdit.value;
    if (value && !value.blank()) {      
      var ruleId = nameEdit.readAttribute("data-meta-id");
      if (ruleId) {        
        scForm.postRequest("","","","rule:rename(ruleId=" + ruleId + ",name=" + encodeURIComponent(value.escapeHTML().gsub(/"/,'&quot;')) + ")", null, true);
      }                     
    }
  };
  
  Sitecore.CollapsiblePanel.showActionsMenu = function(element, evt) {        
    var $element = $(element);
    if (!$element) {
      return;
    }

    var container = $element.up(".rule-container");
    if (!container) {
      return;
    }

    var hasMoveActions = false;
    if (!this.getPreviousRule(container)) {
      container.down("tr#moveUp").hide();
    }
    else {      
      container.down("tr#moveUp").show();
      hasMoveActions = true;
    }

    if (!this.getNextRule(container)) {
      container.down("tr#moveDown").hide();
    }
    else {
      container.down("tr#moveDown").show();
      hasMoveActions = true;
    }

    if (hasMoveActions) {
      container.down("tr#moveDivider").show();
    }
    else {
      container.down("tr#moveDivider").hide();
    }        
  };  
  

function scTogglePersonalizeComponentSection() {  
  $$(".set-rendering").invoke("toggle");      
};

function scSwitchRendering(element, evt, id) {
  var setRendering = $(id + "_setrendering");
  if (setRendering) {
    setRendering.toggleClassName("display-off");
  }

  var setDatasource = $(id + "_setdatasource");
  if (setDatasource) {
    setDatasource.toggleClassName("display-off");
  }
 
  scForm.postRequest("", "", "", "SwitchRenderingClick(\"" + id + "\")");
};

function scCreateSortable() { 
  Sortable.create('non-default-container', {
      tag: "div",
      handle: "drag-handle",      
      format: /^([0-9a-zA-Z]{32})$/,
      hoverclass: "drag-over",
      onChange: function(rule) {
        window.changingRule = rule;        
      },
      onUpdate: function() {
        if (scForm.browser.isIE) {
          // Force redraw
          $$(".rule-container").each(function(r) {r.setStyle({opacity: 0});r.setStyle({opacity: 1});});
        }

        if (window.changingRule) {                                  
           var prevRule = Sitecore.CollapsiblePanel.getPreviousRule(changingRule);
           if (prevRule) {        
              scForm.postRequest("","","","MoveConditionAfter(\"" + changingRule.id + "\",\"" + prevRule.id + "\")", null, true);
              return; 
           }

           var nextRule = Sitecore.CollapsiblePanel.getNextRule(changingRule);
           if (nextRule) {        
              scForm.postRequest("","","","MoveConditionBefore(\"" + changingRule.id + "\",\"" + nextRule.id + "\")", null, true);
              return; 
           }
        }                
      }     
    });
};

Event.observe(document, "dom:loaded", function() {  
  scCreateSortable();  
});