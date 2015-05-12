define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/RibbonPageCode.js"
  ],
function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "RibbonBreadcrumb",
    base: "ControlBase",
    selector: ".sc-breadcrumb",
    attributes: [
    ],

    breadcrumpStructure: [],

    selectedItem: null,

    goText: "",
    editText: "",
    editTooltip: "",
    treeViewTooltip: "",

    initialize: function () {
      //this._super();
      document.breadcrumbContext = this;
      window.parent.document.breadcrumbContext = this;
      this.goText = this.$el[0].attributes["data-sc-dic-go"].value;
      this.editText = this.$el[0].attributes["data-sc-dic-edit"].value;
      this.editTooltip = this.$el[0].attributes["data-sc-dic-edit-tooltip"].value;
      this.treeViewTooltip = this.$el[0].attributes["data-sc-dic-treeview-tooltip"].value;
      this.renderNavigationBar(this.$el[0].attributes["data-sc-itemid"].value);
      Sitecore.ExperienceEditor.Common.registerDocumentStyles(["/-/speak/v1/ribbon/Breadcrumb.css"], window.parent.document);
    },

    renderNavigationBar: function (itemId) {
      this.selectedItem = itemId;
      this.requestBreadcrumpStructure(itemId, this);

      var items = this.breadcrumpStructure;
      var htmlSource = "";
      htmlSource += this.generateNavigationBarTreeViewButton(this.treeViewTooltip);
      var lastItem = null;
      for (var i = 0; i < items.length; i++) {
        var source = "";
        source += this.generateNavigationBarMenuItemHtml(items[i]);
        source += this.generateNavigationBarItemHtml(items[i]);
        htmlSource += this.generateNavigationBarBlockHtml(source);
        lastItem = items[i];
      }

      if (lastItem && lastItem.HasChildren) {
        lastItem.ParentId = lastItem.ItemId;
        htmlSource += this.generateNavigationBarBlockHtml(this.generateNavigationBarMenuItemHtml(lastItem));
      }

      var isItemValid = lastItem && this.selectedItem.ItemId != lastItem.ParentId;
      var enabled = isItemValid && lastItem.HasLayout;
      var canEdit = isItemValid && lastItem.CanEdit;
      htmlSource += "<div class=\"sc-breadcrumb-item\">";
      htmlSource += this.generateNavigationBarButtonHtml(enabled, this.goText, "javascript:document.breadcrumbContext.navigateToItem(document.breadcrumbContext.selectedItem);", "btn-primary", "");
      htmlSource += this.generateNavigationBarButtonHtml(canEdit, this.editText, "javascript:document.breadcrumbContext.editItemInCE(document.breadcrumbContext.selectedItem);", "btn-default", this.editTooltip);
      htmlSource += "</div>";
      var breadcrumbContent = Sitecore.ExperienceEditor.ribbonDocument().getElementById("breadcrumbContent" + this.$el[0].attributes["data-sc-itemid"].value);
      breadcrumbContent.innerHTML = htmlSource;

      this.hideMenu();
    },

    navigateToItem: function (itemId) {
      Sitecore.ExperienceEditor.navigateToItem(itemId);
    },

    editItemInCE: function (itemId) {
      Sitecore.ExperienceEditor.navigateToItemInCE(itemId);

      var url = window.parent.location.toString();
    },

    generateNavigationBarButtonHtml: function (enabled, text, functionSource, buttonStyle, tooltip) {
      var onclickFunction = "#";
      var additionalClass = " scContentButtonDisabled";
      if (enabled) {
        onclickFunction = functionSource;
        additionalClass = "";
      } else {
        buttonStyle += " " +"disabled";
      }

      var htmlSource = "";
      htmlSource += "<a class=\"scContentButton" + additionalClass + "\" href=\"" + onclickFunction + "\" title=\"" + tooltip + "\">";

      htmlSource += "<button data-sc-id='CancelButton' class='btn sc-button " + buttonStyle + "' type='button'>";
      htmlSource += "<span class='sc-button-text data-sc-registered' data-bind='text: text'>" + text + "</span>";
      htmlSource += "</button>";

      htmlSource += "</a>";
      return htmlSource;
    },

    generateNavigationBarTreeViewButton: function () {
      var functionDefinition = "javascript:document.breadcrumbContext.renderTreeViewIframe();";
      return "<div class='sc-breadcrumb-item' title='" + this.treeViewTooltip + "'><a id='navigationTreeViewButton' class='sc-breadcrumb-item-button' href='" + functionDefinition + "'><img alt='' src='/sitecore/shell/~/icon/Office/16x16/elements_tree.png.aspx' /></a></div>";
    },

    generateNavigationBarBlockHtml: function (source) {
      return "<div class='sc-breadcrumb-item'>" + source + "</div>";
    },

    generateNavigationBarItemHtml: function (item) {
      var breadcrumbItemFunction = "javascript:document.breadcrumbContext.renderNavigationBar('" + item.ItemId + "');";
      return "<a class=\"sc-breadcrumb-item-path\" href=\"" + breadcrumbItemFunction + "\" title=\"Breadcrumb path\">" + item.DisplayName + "</a>";
    },

    generateNavigationBarMenuItemHtml: function (item) {
      var contextMenuFunction = "javascript:document.breadcrumbContext.renderContextMenu('" + item.ParentId + "');";
      return "<a id=\"breadcrumbMenuSubcontrol" + item.ParentId + "\" class=\"sc-breadcrumb-item-action\" href=\"" + contextMenuFunction + "\" title=\"Breadcrumb action\"><img src=\"/sitecore/shell/client/Speak/Assets/img/Speak/Common/16x16/dark_gray/separator.png\"/></a>";
    },

    requestBreadcrumpStructure: function (itemId, appContext) {
      var context = Sitecore.ExperienceEditor.generateDefaultContext();
      context.currentContext.itemId = itemId;
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Breadcrumb.GetStructure", function (response) {
        appContext.breadcrumpStructure = response.responseValue.value;
      }).execute(context);
    },

    renderContextMenu: function (id) {
      window.parent.document.addEventListener('click', function() {
        window.parent.document.breadcrumbContext.hideMenu();
      }, false);

      document.addEventListener('click', function () {
        window.parent.document.breadcrumbContext.hideMenu();
      }, false);

      var context = Sitecore.ExperienceEditor.generateDefaultContext();
      context.currentControl = this;
      context.currentContext.itemId = id;
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Breadcrumb.GetChildItems", function (response) {
        var control = document.getElementById("breadcrumbMenuSubcontrol" + id);
        var position = control.getBoundingClientRect();
        var positionStyle = "top:" + (position.top + 35) + "px;" + "left:" + (position.left + 0) + "px;";
        var menuControlId = "breadcrumbMenuSubcontrol_context_menu";
        var menuSource = "<nav id='" + menuControlId + "' style='position:absolute;z-index:10000;" + positionStyle + "' class=''>" + response.context.currentControl.generateContextMenuHtmlSource(response.responseValue.value) + "</nav>";
        var element = window.parent.document.getElementById(menuControlId);
        if (!element) {
          var iDiv = window.parent.document.createElement('nav');
          iDiv.id = menuControlId;
          iDiv.style.display = "none";
          window.parent.document.getElementsByTagName('body')[0].appendChild(iDiv);
          element = window.parent.document.getElementById(menuControlId);
        }
        element.outerHTML = menuSource;
        element.style.display = "";
      }).execute(context);
    },

    renderTreeViewIframe: function () {
      var element = window.document.getElementById("navigationTreeViewButton");
      if (!element) {
        return;
      }

      var treeViewUrl = "/sitecore/client/Applications/ExperienceEditor/Pages/NavigationTreeView.aspx";
      var dimensions = {
        width: "300px",
        height: "320px"
      };
      Sitecore.ExperienceEditor.Common.showGallery(treeViewUrl, element, dimensions);
    },

    hideMenu: function () {
      var menuControlId = "breadcrumbMenuSubcontrol_context_menu";
      var element = window.parent.document.getElementById(menuControlId);
      if (element && element.style) {
        element.style.display = "none";
      }
    },

    generateContextMenuHtmlSource: function (items) {
      var htmlSource = "<nav data-sc-id=\"RibbonBreadcrumb\" style=\"padding-top:0.3em;padding-bottom:0.3em;padding-left:0.3em;overflow: hidden;\" class=\"sc-breadcrumb data-sc-registered sc-breadcrumb-item-rectangle sc\">";
      for (var i = 0; i < items.length; i++) {
        var contextMenuFunction = "javascript:document.breadcrumbContext.renderNavigationBar('" + items[i].ItemId + "');";
        htmlSource += "<a style=\"display:block !important; width:100%;height:16px;\" class=\"sc-breadcrumb-item-path\" href=\"" + contextMenuFunction + "\">";
        htmlSource += items[i].ImageUrl;
        htmlSource += "<span style='text-transform:none;font-size: 12px;font-family: Arial, Helvetica, sans-serif;vertical-align:text-top;height:16px;'>" + items[i].DisplayName + "</span>";
        htmlSource += "</a>";
        htmlSource += "<br style=\"height:0.1px;\"/>";
      }

      htmlSource += "</nav>";
      return htmlSource;
    },
  });
});