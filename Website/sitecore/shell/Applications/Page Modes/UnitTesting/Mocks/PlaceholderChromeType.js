Sitecore.PageModes.ChromeTypes.Placeholder.prototype.addControl = function(position, options) {
   this._insertPosition = position;
   var controlId = options.controlId;
   var openProperties = options.openProperties;
   var datasource = options.datasource;
   this.addControlResponse(controlId, openProperties, datasource);   
};