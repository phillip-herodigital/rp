if (typeof(Sitecore) == "undefined") {
  Sitecore = {};
}

Sitecore.CollapsiblePanel = new function() {
  this.load = function() {
    var headerTitles, headerTitles;
    $sc("div.icon-expand").live("click", this.togglePanel);    
    $sc(".panel-header").live("dblclick", this.togglePanel);
    headerTitles = $sc("a.header-title");
    headerTitles.live("click", this.editName);
    headerTitles.live("dblclick", function(e) {e.stopPropagation();});
    
    headerEdits = $sc("input.header-title-edit");        
    headerEdits.live("blur", this.editNameComplete);
    headerEdits.live("dblclick", function(e) {e.stopPropagation();});   
    $sc("a.action-combo").live("click", this.showMenu);
    $sc(document.body).click(this.collapseMenus);   
  };
  
  this.editName = function(event) {
    var name = null;
    if ($sc.type(event) == "string") {
      name = $sc("#" + event).find("a.header-title");
    }
    else {
      name = $sc(event.target);
    }

    name.hide();
    name.next(".header-title-edit").show().select();   
  };

  this.editNameComplete = function(event) {
    var newName = $sc(event.currentTarget);
    var value = newName.val();
    if ($sc.trim(value) === "") {       
       alert(newName.attr("data-validation-msg"));
       newName.focus();       
       return;                
    }

    newName.hide();
    newName.prev("a.header-title").text(value).show();    
  };

  this.editNameChanging = function(element, event) {        
    if (event.keyCode == 13) {                   
      scForm.browser.clearEvent(event, true, true);   
      try {
        element.blur();
      }
      catch(ex) {}                 
    }
  };

  this.collapseMenus = function() {
    $sc(".menu-expanded").removeClass("menu-expanded");
  };
  
  this.showMenu = function(event) {   
    var combo = $sc(event.currentTarget);
    combo.addClass("menu-expanded");
    var id =combo.next(".scMenu")[0].id;
    scForm.showPopup(null, combo[0].id, id, "below");
  };

  this.togglePanel = function(event) {
    var target = $sc(event.target);
    var header = target.closest(".panel-header");
    var panelBody = header.next(".panel")[0];
    if (!panelBody) {
      return;
    }
    
    header.find(".icon-expand").toggleClass("collapsed");
    $sc(panelBody).slideToggle(200);
  };

  $sc(document).ready($sc.proxy(this.load, this));  
};