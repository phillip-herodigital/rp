define(["sitecore", "bootstrap"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("data", null);
      this.set("tables", "");
      this.set("messages", "");
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
      this.model.on("change:data", this.updateView, this);
    },
    
    updateView: function() {
      var tables = "";
      var messages = "";

      var data = this.model.get("data");

      if (data && data.table) {
        var table = _.isArray(data.table) ? data.table : [data.table];

        _.each(table, function(i) {
          if (i.columns) {
            tables += this.renderTable(i);
          }

          if (i.value) {
            messages += i.value;
          }
        }, this);

        messages = messages.replace(/\r?\n|\r/g, "<br />");
      }

      this.model.set("tables", tables != "" ? tables : "There are no results to show.");
      this.model.set("messages", messages != "" ? messages : "There are no messages");
      
      if (tables != "") {
        $('#resultPane a[href="#tables"]').tab('show');
      } else {
        $('#resultPane a[href="#messages"]').tab('show');
      }
    },
    
    renderTable: function(table) {
      var result = "<table class=\"table table-striped table-bordered table-condensed\">";

      var column = _.isArray(table.columns.column) ? table.columns.column : [table.columns.column];
      result += "<tr>";
      _.each(column, function (c) {
        result += "<td>";
        result += c.name;
        result += "</td>";
      }, this);
      result += "</tr>";

      var row = _.isArray(table.rows.row) ? table.rows.row : [table.rows.row];
      _.each(row, function (r) {
        result += "<tr>";

        var value = _.isArray(r.value) ? r.value : [r.value];
        _.each(value, function (v) {
          result += "<td>";

          if (_.isString(v)) {
            result += v;
          }
          
          result += "</td>";
        }, this);

        result += "</tr>";
      }, this);

      result += "</table>";

      return result;
    }
  });

  Sitecore.Factories.createComponent("QueryAnalyzerResultPane", model, view, ".sc-queryAnalyzerResultPane");
});
