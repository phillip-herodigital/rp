define(["sitecore", "/-/speak/v1/pathanalyzer/PathAnalyzer.js"], function (Sitecore, pathAnalyzer) {
    Sitecore.Factories.createBaseComponent({
        name: "TreeDefinitionFilter",
        base: "ControlBase",
        selector: ".sc-TreeDefinitionFilter",
        attributes: [
          { name: "selectedTreeDefinitionValue", defaultValue: null },
          { name: "selectedTreeDefinitionName", defaultValue: null }
        ],

        extendModel: {
        },

        afterRender: function () {
            var initialItemDefinition = this.$el.attr("data-sc-initialitem");
            if (!initialItemDefinition)
                return;

            var parts = initialItemDefinition.split(','); //displayname,databasename,itemid
            this.model.set("selectedTreeDefinitionValue", parts[2]);
            this.model.set("selectedTreeDefinitionName", parts[0]);
            pathAnalyzer.setTreeDefinition(parts[2]);
        },
        
        setSelectedTreeDefinition: function (value) {
            var appName = this.model.get("name"),
                treeDefinitionTreeView = this.app[appName + "TreeDefinitionTreeView"],
                treeDefinitionId = value || treeDefinitionTreeView.get("selectedItemId");
            
            this.model.set("selectedTreeDefinitionValue", treeDefinitionId);
            var selectedNode = treeDefinitionTreeView.get("selectedNode");
            this.model.set("selectedTreeDefinitionName", selectedNode.title);
            
            pathAnalyzer.setTreeDefinition(treeDefinitionId);
        }
    });
});