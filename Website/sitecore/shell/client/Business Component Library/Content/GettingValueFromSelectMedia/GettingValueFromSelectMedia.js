/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />


define(["sitecore"], function (_sc) {
    var DialogCommunication = _sc.Definitions.App.extend({
        initialized: function () {
            _sc.on("sc-frame-message", this.updateImage, this);
        },
        updateImage: function (value) {
            var self = this;
            if (!value) {
                alert("you did not choose any image");
            } else {
                var databaseUri = new Sitecore.Definitions.Data.DatabaseUri("master");
                var database = new Sitecore.Definitions.Data.Database(databaseUri);
                database.getItem(value, function (item) {
                    self.Image.set("imageUrl", item.$mediaurl);
                });
            }
            this.DialogWindow.hide();
        }
    });

    return DialogCommunication;
});