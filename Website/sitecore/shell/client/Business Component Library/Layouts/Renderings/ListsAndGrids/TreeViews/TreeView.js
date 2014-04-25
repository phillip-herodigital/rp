/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />
/// <reference path="../../../../../../assets/vendors/underscore/underscore.js" />

define(['sitecore', 'dynatree'], function (_sc) {
  var control = {
    componentName: "TreeView",
    selector: ".sc-treeview",
    control: "dynatree",
    namespace: "ui-",

    attributes:
    [
      { name: "selectedItemId", added: true },
      { name: "selectedItemPath", added: true },
      { name: "checkedItemIds", added: true },
      { name: "pathToLoad", added: true },
      { name: "isBusy", added: true },
      { name: "selectedNode", added: true },
      { name: "showSitecoreIcons", added: true, defaultValue: true },
      { name: "isCheckboxEnabled", pluginProperty: "checkbox", defaultValue: true },     // Show checkboxes.
      { name: "isKeyboardSupported", pluginProperty: "keyboard", defaultValue: true },     // Support keyboard navigation.
      { name: "isPersist", pluginProperty: "persist", defaultValue: false },      // Persist expand-status to a cookie
      { name: "isAutoFocus", pluginProperty: "autoFocus", defaultValue: true },    // Set focus to first child, when expanding or lazy-loading.
      { name: "isAutoCollapse", pluginProperty: "autoCollapse", defaultValue: false }, // Automatically collapse all siblings, when a node is expanded.
      { name: "clickFolderMode", defaultValue: 1 }, // 1:activate, 2:expand, 3:activate and expand
      { name: "selectMode", defaultValue: 3 },      // 1:single, 2:multi, 3:multi-hier
      { name: "isNoLink", pluginProperty: "noLink", defaultValue: false },       // Use <span> instead of <a> tags for all nodes
      { name: "debugLevel", defaultValue: 0 }       // 0:quiet, 1:normal, 2:debug
    ],

    events:
    [
      { name: "onPostInit" },        // Callback(isReloading, isError) when tree was (re)loaded.
      { name: "onActivate", on: "onActivate" },        // Callback(dtnode) when a node is activated.
      { name: "onDeactivate" },      // Callback(dtnode) when a node is deactivated.
      { name: "onSelect", on: "onSelect" },          // Callback(flag, dtnode) when a node is (de)selected.
      { name: "onExpand" },          // Callback(flag, dtnode) when a node is expanded/collapsed.
      { name: "onLazyRead", on: "nodeExpanding" },   // Callback(dtnode) when a lazy node is expanded for the first time.
      { name: "onCustomRender" },    // Callback(dtnode) before a node is rendered. Return a HTML string to override.
      { name: "onCreate" },          // Callback(dtnode, nodeSpan) after a node was rendered for the first time.
      { name: "onRender" },          // Callback(dtnode, nodeSpan) after a node was rendered.
      { name: "postProcess" }        // Callback(data, dataType) before an Ajax result is passed to dynatree.

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

    view:
    {
      initialized: function () {
        var items = this.$el.attr("data-sc-rootitem");
        if (!items) {
          return;
        }
        
        var pathToLoad = this.$el.attr("data-sc-loadpath");

        if (pathToLoad) {
          this.model.set("pathToLoad", pathToLoad);
        }

        var parts = items.split("|");
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
            icon: this.model.get("showSitecoreIcons") ? itemIcon : "",
            url: "#",
            path: "/" + uri[0],
            itemUri: itemUri,
            selected: selectedItemUri == null
          };

          if (this.widget) {
            this.widget.apply(this.$el, ["getRoot"]).addChild(rootNode);
          }

          if (this.model.get("pathToLoad") && this.model.get("pathToLoad") !== "") {
            this.loadKeyPath();
            
          }
        }

        this.pendingRequests = 0;
      },

      onActivate: function (node) {
        if (node && node.data && node.data.itemUri && node.data.path) {
          
          this.model.set("selectedNode", node.data);
          this.model.set("selectedItemId", node.data.itemUri.itemId);
          this.model.set("selectedItemPath", node.data.path);
        }
      },

      onSelect: function (flag, node) {
        var list = [];

        _.each(node.tree.getSelectedNodes(), function (dnode, index) {
          list.push(dnode.data.itemUri.itemId);
        });
        this.model.set("checkedItemIds", list.join("|"));
      },

      nodeExpanding: function (node) {

        var itemUri = node.data.itemUri, children;
        
        this.pendingRequests++;
        this.model.set("isBusy", true);

        var self = this;
        
        var database = new _sc.Definitions.Data.Database(itemUri.getDatabaseUri());
        database.getChildren(itemUri.getItemId(), function (items) {
          var res = [];

          self.appendLoadedChildren(node, items, res);
          
          self.pendingRequests--;
          if (self.pendingRequests <= 0) {
            self.pendingRequests = 0;
            self.model.set("isBusy", false);
          }

          if (self.model.get("pathToLoad") && self.model.get("pathToLoad").length > 0) {
            self.loadKeyPath();
          }
        });
        
      },
      appendLoadedChildren:function (parentNode, childrenNodes, destArray) {
        //add children
        
        var self = this;
        _.each(childrenNodes, function (item) {
          var newNode = {};
          newNode.rawItem = item;
          newNode.title = item.$displayName;
          newNode.key = item.itemId;
          if (self.model.get("showSitecoreIcons")) {
            newNode.icon = item.$icon;
          }
          newNode.itemUri = item.itemUri;
          newNode.path = item.$path;
          newNode.select = parentNode.isSelected();
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
            path = this.model.get("pathToLoad"),
            tree = this.widget.apply(this.$el, ["getTree"]),
            node;
        
        pathParts = path.split(separator);
        if (pathParts.length === 0) {
          return false;
        }
        else {
          currentNodeId = pathParts.shift();
          if (!currentNodeId) return false;
          node = tree.getNodeByKey(currentNodeId);
          if (!node) {
            this.model.set("pathToLoad", "");

            return false;
          }
          
          
          this.model.set("pathToLoad", pathParts.join(separator));
          node.expand();
          
          if (pathParts.length === 0) {
            this.model.set("selectedItemId", currentNodeId);
            node.activate(true);
            node.select(true);
          }

        }
      }
    }
  };

  _sc.Factories.createJQueryUIComponent(_sc.Definitions.Models, _sc.Definitions.Views, control);
});
