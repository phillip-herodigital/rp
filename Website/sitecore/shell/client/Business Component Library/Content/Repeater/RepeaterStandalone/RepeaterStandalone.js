/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />


define(["sitecore"], function (_sc) {
    var Repeater = _sc.Definitions.App.extend({
      initialized: function () {
        _sc.on("removeSubApp", this.removeCustomer, this);
      },
      removeCustomer: function (app) {
        var self = this,
            item = this.Repeater.getItem(app);

        item.toModel().destroy({
          success: function () {
            self.Repeater.remove(app);
          }
        });
      },         
      createCustomer: function () {
        var self = this;
          if (this.Firstname.get("text") && this.Lastname.get("text")) {
              var firstName = this.Firstname.get("text"),
                  lastName = this.Lastname.get("text"),
                  fullName = firstName + lastName;

              var database = this.DataSource.get("database");

              _sc.Definitions.Data.createItem({
                  templateId: "{9DF2897A-7874-42E1-9A14-EA71E94A3337}",
                  name: fullName,
                  parentId: "{085654F9-6696-480A-804B-CC21E88A3127}",
                  database: database
              }, {
                  Firstname: firstName,
                  Lastname: lastName
              }, function (item) {
                self.Repeater.add(item);
              });
          }
      }
    });

    return Repeater;
});