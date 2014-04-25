/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
    var Repeater = _sc.Definitions.App.extend({
      initialized: function () {
        console.log(this);
      },
      
      delete: function () {
        _sc.trigger("removeSubApp", this);
      }      
       
    });

    return Repeater;
});