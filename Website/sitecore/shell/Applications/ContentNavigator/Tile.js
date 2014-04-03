Sitecore.ContentNavigator.Tile = Class.create({
  initialize: function(element) {
    this.element = element;
  },
  
  deselect: function() {
    this.element.removeClassName("selected");
  },
  
  equals: function(tile) {
    return this.element == tile.element;
  },
  
  expand: function(event) {
    console.info("expand");
    
    if (event) {
      event.stop();
    }
    
    if (Sitecore.ContentNavigator.expandedTile) {
      Sitecore.ContentNavigator.expandedTile.normalize();
      
      if (Sitecore.ContentNavigator.expandedTile.element == this.element) {
        Sitecore.ContentNavigator.expandedTile = null;
        return;
      }
    }    
    
    
    //HACK
    if (Prototype.Browser.IE) {
      new Effect.Morph(this.element, {
        style: { height: "256px", width: "256px" },
        duration: 0.3 
      })
    }
    else {
      new Effect.Morph(this.element, {
        style: { height: "274px", width: "274px" },
        duration: 0.3 
      })
    }
    
    this.element.down(".expandButton").innerHTML = "collapse";
    Sitecore.ContentNavigator.expandedTile = this;
  },
  
  header: function() {
    this.element.down(".scItemTileHeader").innerHTML;
  },
  
  normalize: function() {
    console.info("normalize");
    
    new Effect.Morph(this.element, {
      style: { height: "128px", width: "128px" },
      duration: 0.3 
    })
  },
  
  onMouseOver: function() {
    if (this.element.select(".scHoverButtons").length > 0) {
      return;
    }
    
    var buttons = new Element("div", { className: "scHoverButtons" });
    
    var expand = new Element("div", { className: "expandButton" });
    expand.innerHTML = "Expand";
    expand.observe("click", this.expand.bindAsEventListener(this));
    
    buttons.insert(expand);
    
    this.element.insert(buttons);
  },
  
  onMouseOut: function(event) {
    var buttons = this.element.down(".scHoverButtons");
    if (buttons) {
      buttons.remove();
    }
  },
  
  select: function() {
    this.element.addClassName("selected");
  }
});