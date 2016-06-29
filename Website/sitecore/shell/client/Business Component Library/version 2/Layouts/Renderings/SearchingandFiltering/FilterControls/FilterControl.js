define(["sitecore", "knockout"], function (speak, ko) {
  speak.component({
    name: "FilterControl",
    initialize: function () {
      this.defineProperty("FacetList", []);
    },
    initialized: function () {
      this.on("change:Facets", this.changeFacets, this);
      this.updating = false;
    },
    changeFacets: function () {
      this.updating = false;

      if (this.viewModel.FacetList() != null && this.viewModel.FacetList().length > 0) {
        return;
      }

      this.updateFacets();
    },
    updateFacets: function () {
      var facets = this.Facets;
      var facetList = [];
      var self = this;

      facets.forEach(function (facet) {
        var f = {
          name: facet.Name,
          values: new ko.observableArray()
        };

        facet.Values.forEach(function (value) {
          var v = {
            name: facet.Name,
            displayText: value.DisplayText,
            value: value.Value,
            count: new ko.observable(value.Count),
            checked: new ko.observable(false)
          };

          v.checked.subscribe(function (newValue) {
            self.toggleFacet(newValue, v);
          });

          f.values().push(v);
        }, this);

        facetList.push(f);

      }, this);

      this.viewModel.FacetList(facetList);
      this.SelectedFacets = [];
    },

    toggleFacet: function (value, element) {
      if (value) {
        this.addFacet(element.name, element.value);
      }
      else {
        this.removeFacet(element.name, element.value);
      }
    },
    addFacet: function (name, value) {
      var selectedFacets = this.SelectedFacets.slice(0); // clone the array
      selectedFacets.push({ name: name, value: value });

      this.updating = true;
      this.SelectedFacets = selectedFacets;
    },
    removeFacet: function (name, value) {
      var selectedFacets = this.SelectedFacets;

      selectedFacets = selectedFacets.filter(function (i) {
        return !(i.name === name && i.value === value);
      }, this);

      this.updating = true;
      this.SelectedFacets = selectedFacets;
    }
  });
});