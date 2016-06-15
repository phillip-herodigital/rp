(function (speak) {

  require.config({
    paths: {
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
      selection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Selection",
      select2: "/sitecore/shell/client/Business Component Library/version 2/Assets/lib/deps/select2/select2"
    }
  });


  speak.component(["collection", "selection", "select2"], function (Collection, Selection) {
    var createGroupedItems = function (hookEvent) {
      if (!this.GroupFieldName) {
        return;
      }

      var groups = _.groupBy(hookEvent.data, this.getGroupName, this),
        groupedItems = _.map(groups, function (group, key) {
          return { groupName: key, optionItems: group };
        });

      hookEvent.result(groupedItems);
    },
      
    selectValue = function() {
      this.$el.find("select").select2("val", this.SelectedValue);
    },
    
    renderItems = function (items) {
      var renderMethod = this.GroupFieldName ? renderGroups : renderOptions;
      return renderMethod.call(this, items);
    }

    renderOptions = function(option) {
      return '<option value="' + this.getValue(option) + '">' + this.getDisplayName(option) + '</option>';
    },

    renderGroups = function (group) {
      var options = group.optionItems.map(renderOptions, this);
      return '<optgroup label="' + group.groupName +'">' + options.join("") + '</optgroup>';
    };

    return speak.extend({}, Collection.prototype, Selection.prototype, {
      name: "SearchableDropList",

      initialized: function () {
        // Register hook before super is called on Collection,
        // to also create groups for initial data
        this.on("hook:Items", createGroupedItems, this);

        // Super
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);

        this.$el = $(this.el);

        // Initialize select2 plugin and handle user input
        this.$el.find("select")
          .change(function (event) {
            this.selectByValue(event.val);
          }.bind(this))
          .select2({ formatNoMatches: this.$el.data("sc-text-nomatches") })
          .removeClass("hide");

        // Update view
        this.on("change:Items", this.render, this);
        this.on("change:SelectedValue", selectValue, this);
      },

      render: function () {
        if (!this.hasData()) {
          this.$el.find("select").empty();
          return;
        }

        var items = this.Items.map(renderItems, this);
        this.$el.find("select").html(items.join(""));
        selectValue.call(this);
      },

      getGroupName: function (item) {
        return item[this.GroupFieldName];
      }
    });
  }, "SearchableDropList");
})(Sitecore.Speak);