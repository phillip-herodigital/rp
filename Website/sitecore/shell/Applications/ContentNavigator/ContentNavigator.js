if (!Sitecore) {
  var Sitecore = new Object();
}

Sitecore.ContentNavigator = new function() {
  this.name = "Content navigator";
  this.selectedTiles = new Array();
}

Sitecore.ContentNavigator.clearSelection = function() {
  this.selectedTiles.each(function(tile) {
    tile.deselect();
  });
  
  this.selectedTiles.clear();
  $("SelectionPane").innerHTML = "";
}

Sitecore.ContentNavigator.initTiles = function() {
  console.log(this);
  
  $$(".scItemTile").each(function(tile, index) {
    tile.observe("click", Sitecore.ContentNavigator.select.bindAsEventListener(Sitecore.ContentNavigator));
    tile.observe("mouseover", Sitecore.ContentNavigator.onMouseOver.bindAsEventListener(Sitecore.ContentNavigator));
  });
}

Sitecore.ContentNavigator.onMouseOver = function(event) {
  if (!$(event.target).hasClassName("scItemTile")) {
    return;
  }

  var tile = new Sitecore.ContentNavigator.Tile(event.target);
  
  if (this.mouseOverTile) {
    if (this.mouseOverTile.equals(tile)) {
      return;
    }
    else {
      this.mouseOverTile.onMouseOut();
    }
  }
  
  this.mouseOverTile = tile;  
  tile.onMouseOver();
}

Sitecore.ContentNavigator.select = function(event, tile) {
  if (!tile) {
    var element = event.target;
    if (!element.hasClassName("scItemTile")) {
      element = element.up(".scItemTile");
    }

    tile = new Sitecore.ContentNavigator.Tile(element);
  }
  
  tile.select();
  
  if (!event.ctrlKey) {
    this.clearSelection();
  }
  
  this.selectedTiles.push(tile);    
  
  this.addToSelectionPane(tile);
  
  event.stop();
}

Sitecore.ContentNavigator.addToSelectionPane = function(tile) {
  var element = "<a href='#' class='scItemTile'>" + tile.element.innerHTML + "</a>";
  $("SelectionPane").insert(element);
}