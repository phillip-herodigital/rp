/*AttributeCollection*/

Sitecore.AttributeCollection = new function() {

    Sitecore.UI.ModifiedTracking.track(true, Sitecore.App.getParentForm());
 
    Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.PropertiesBuilder.load() } );

    /* onload */
    this.load = function(sender, evt) {
    }
    
    this.parse = function(object) {
        Object obj = object;
        return obj;
    }
}