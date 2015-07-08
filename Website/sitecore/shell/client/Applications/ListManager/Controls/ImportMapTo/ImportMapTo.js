define(["sitecore", "backbone"], function (sitecore, backbone) {

  var mapToRow = backbone.LayoutManager.extend({
    template: "importmapto-row",
    initialize: function (options) {
      this.parent = options.parent;
    },
    afterRender: function () {
      this.sync();
    },
  });

  sitecore.Factories.createBaseComponent({
    name: "ImportMapTo",
    base: "ControlBase",
    selector: ".sc-importMapTo",
    rowSelector: ".sc-importmaptobody",
    initialize: function () {
      this.originalModel = this.$el.data("sc-importmodel") ? this.$el.data("sc-importmodel") : [];
      this.mapToRows = [];
      this.MappingModel = [];
      this.RequiredModel = [];
      this.unselectedValue = -1;
    },
    onSelectChange: function (el) {
      var self = this;
      var value = !isNaN(el.value) ? Number(el.value) : this.unselectedValue;
      var mappingModelIndex = $(el).attr("data-position");

      if (typeof mappingModelIndex !== "undefined" && self.MappingModel[mappingModelIndex]) {
        self.MappingModel[mappingModelIndex].value = value;
      }
      self.model.trigger("import:mapto:select:changed");
    },
    addRows: function (csvData) {
      var self = this;
      var baseSelector = self.$el.find(this.rowSelector);

      Array.prototype.filter.call(self.originalModel, function (originalModelFieldValue) {
        if (originalModelFieldValue.Required) {
          self.RequiredModel.push(originalModelFieldValue);
        }
      });

      for (var i = 0; i < self.originalModel.length; i++) {
        var fieldValue = self.originalModel[i];
        self.MappingModel.push({ key: fieldValue.DataField, value: this.unselectedValue }).toString();

        var fieldModel = backbone.Model.extend({ defaults: { fieldName: '', dataField: '', required: false, position: '', fileFields: [] } });

        var field = new fieldModel({ fieldName: fieldValue.FieldName, dataField: fieldValue.DataField, required: fieldValue.Required, position: i, fileFields: csvData });
        var mapToRowPanel = new mapToRow({ model: field, parent: self, app: self.app, serialize: field.toJSON() });

        self.mapToRows.push(mapToRowPanel);
        var addedElement = baseSelector.append(mapToRowPanel.el);
        mapToRowPanel.render();
        
        var selectBox = addedElement.find('select');
        selectBox.on("change", function () {
          self.onSelectChange(this);
        });
        selectBox.attr("selectedIndex", this.unselectedValue);
      }
    },
    resetRows: function () {
      var self = this;
      Array.prototype.filter.call(self.mapToRows, function (mapToRowPanel) {
        mapToRowPanel.remove();
        mapToRowPanel.render();
      });
      self.mapToRows = [];
      self.RequiredModel = [];
      self.MappingModel = [];
      var baseSelector = self.$el.find(this.rowSelector);
      if (baseSelector) {
        baseSelector.empty();
      }
    },
    allRequiredSelected: function () {
      var self = this;
      var returnValue = true;
      for (var j = 0; j < self.RequiredModel.length; j++) {
        var selected = false;
        for (var i = 0; i < self.MappingModel.length; i++) {
          if (self.MappingModel[i].key === self.RequiredModel[j].DataField) {
            selected = self.MappingModel[i].value !== this.unselectedValue;
            break;
          }
        }
        if (!selected) {
          returnValue = false;
          break;
        }
      }
      return returnValue;
    },
    getMappingModel: function () {
      var self = this;
      var returnModel = [];
      Array.prototype.filter.call(self.MappingModel, function (mapping) {
        if (mapping.key != "") {
          returnModel.push(mapping);
        }
      });

      return returnModel;
    }
  });
});