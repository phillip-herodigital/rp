(function (speak, require) {
  require.config({
    paths: {
      dynatree: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/DynaTree/jquery.dynatree-1.2.4",
      dynatreecss: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/DynaTree/skin-vista/ui.dynatree",
      jQueryPresenter: "/sitecore/shell/client/Business Component Library/version 2/Assets/lib/jQueryPresenter"
    },
    shim: {
      "dynatree": { deps: ["jqueryui"] }
    }
  });
  
  speak.component(["dynatree", "jQueryPresenter"], {
    name: "ItemTreeView",
    control: "dynatree",
    options:
    [
      { name: "isCheckboxEnabled", pluginProperty: "checkbox", defaultValue: true },     // Show checkboxes.
      { name: "isKeyboardSupported", pluginProperty: "keyboard", defaultValue: true },     // Support keyboard navigation.
      { name: "isPersist", pluginProperty: "persist", defaultValue: false },      // Persist expand-status to a cookie
      { name: "isAutoFocus", pluginProperty: "autoFocus", defaultValue: true },    // Set focus to first child, when expanding or lazy-loading.
      { name: "isAutoCollapse", pluginProperty: "autoCollapse", defaultValue: false }, // Automatically collapse all siblings, when a node is expanded.
      { name: "clickFolderMode", defaultValue: 1 }, // 1:activate, 2:expand, 3:activate and expand
      { name: "selectMode", pluginProperty: "SelectMode", defaultValue: 3 },      // 1:single, 2:multi, 3:multi-hier
      { name: "isNoLink", pluginProperty: "noLink", defaultValue: false },       // Use <span> instead of <a> tags for all nodes
      { name: "debugLevel", defaultValue: 0 },       // 0:quiet, 1:normal, 2:debug
      { name: "showHiddenItems", defaultValue: false },
      { name: "contentLanguage", defaultValue: "en" },
      { name: "showIconImage", defaultValue: true }
    ],
    events:
    [
      { name: "onActivate", on: "onActivate" },        // Callback(dtnode) when a node is activated.
      { name: "onSelect", on: "onSelect" },          // Callback(flag, dtnode) when a node is (de)selected.
      { name: "onLazyRead", on: "nodeExpanding" }   // Callback(dtnode) when a lazy node is expanded for the first time.
    ],
    functions:
    [
      { name: "disable" },
      { name: "enable" },
      { name: "getTree" },
      { name: "getRoot" },
      { name: "getActiveNode" },
      { name: "getSelectedNodes" }
    ],

    render: function () {
        if (!this.RootItem) {
          return;
        }

        var parts = this.RootItem.split("|");
        var selectedItemUri = null;

        for (var n = 0; n < parts.length; n++) {
          var uri = parts[n].split(',');

          var databaseUri = new _sc.Definitions.Data.DatabaseUri(uri[1]);
          var itemUri = new _sc.Definitions.Data.ItemUri(databaseUri, uri[2]);
          var itemIcon = uri[3];

          var rootNode = {
            title: uri[0],
            key: itemUri.getItemId(),
            isLazy: true,
            isFolder: true,
            icon: this.ShowIconImage ? itemIcon : "",
            url: "#",
            path: "/" + uri[0],
            itemUri: itemUri,
            selected: selectedItemUri == null
          };

          if (this.widget) {
            this.widget.apply(this.$el, ["getRoot"]).addChild(rootNode);
          }

          if (this.PreLoadPath) {
            this.loadKeyPath();
          }
        }

        this.pendingRequests = 0;
    },

    onActivate: function (node) {
      if (node && node.data && node.data.itemUri && node.data.path) {
        this.SelectedNode = node.data;
        this.SelectedItemId = node.data.itemUri.itemId;
        this.SelectedItemPath = node.data.path;
      }
    },

    onSelect: function (flag, node) {
      var list = [];

      node.tree.getSelectedNodes().forEach(function (dnode, index) {
        list.push(dnode.data.itemUri.itemId);
      });

      this.CheckedItemIds = list.join("|");
    },

    nodeExpanding: function (node) {
      var itemUri = node.data.itemUri;

      this.pendingRequests++;
      this.IsBusy = true;

      var self = this;

      var database = new _sc.Definitions.Data.Database(itemUri.getDatabaseUri());
      database.getChildren(itemUri.getItemId(), function (items) {
        var res = [], filteredItems;

        filteredItems = items;
        if (!self.ShowHiddenItems) {
          filteredItems = _.filter(items, function (item) {
            return item.__Hidden !== "1";
          });
        }

        if (self.Templates) {
          var templateList = self.Templates;
          filteredItems = _.filter(filteredItems, function (item) {
            return templateList.indexOf(item.$templateId, 0) != -1;
          });
        }

        self.appendLoadedChildren(node, filteredItems, res);

        self.pendingRequests--;
        if (self.pendingRequests <= 0) {
          self.pendingRequests = 0;
          self.IsBusy = false;
        }

        if (self.PreLoadPath && self.PreLoadPath.length > 0) {
          self.loadKeyPath();
        }
      }, {
        fields: ["__Hidden"],
        language: self.ContentLanguage
      });
    },

    appendLanguageParameter: function (item) {
      if (item.$icon.indexOf(".ashx") > 0) {
        item.$icon += "&la=" + this.ContentLanguage;
        item.$mediaurl += "&la=" + this.ContentLanguage;
      }
    },

    appendLoadedChildren: function (parentNode, childrenNodes, destArray) {
      //add children

      var self = this;
      childrenNodes.forEach(function (item) {
        var newNode = {
          rawItem: item,
          title: item.$displayName,
          key: item.itemId
        };
        
        if (self.ShowIconImage) {
          self.appendLanguageParameter(item);
          newNode.icon = item.$icon;
        }

        newNode.itemUri = item.itemUri;
        newNode.path = item.$path;
        newNode.select = self.SelectMode === 3 ? parentNode.isSelected() : false;
        newNode.isFolder = item.$hasChildren;
        newNode.isLazy = item.$hasChildren;
        destArray.push(newNode);

      }, this);

      parentNode.setLazyNodeStatus(DTNodeStatus_Ok);
      parentNode.addChild(destArray);
      //expand needed node
    },

    loadKeyPath: function () {
      var separator = "/",
          pathParts,
          currentNodeId,
          path = this.PreLoadPath,
          tree = this.widget.apply(this.$el, ["getTree"]),
          node;

      pathParts = path.split(separator);
      if (pathParts.length === 0) {
        return false;
      }

      currentNodeId = pathParts.shift();
      if (!currentNodeId) {
        return false;
      }

      node = tree.getNodeByKey(currentNodeId);
      if (!node) {
        this.PreLoadPath = "";
        return false;
      }

      this.PreLoadPath = pathParts.join(separator);

      node.expand();

      if (pathParts.length === 0) {
        this.SelectedItemId = currentNodeId;

        node.activate(true);
        node.select(true);
      }
    }
  });
})(Sitecore.Speak, require);