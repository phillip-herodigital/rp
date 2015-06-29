define(["sitecore", "/-/speak/v1/ExperienceEditor/RibbonPageCode.js"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "LargeDropDownButton",
    base: "ButtonBase",
    selector: ".sc-chunk-button-dropdown",
    attributes: [
        { name: "command", value: "$el.data:sc-command" },
        { name: "isPressed", value: "$el.data:sc-ispressed" },
        { name: "iconLabelRequest", value: "$el.data:sc-iconlabelrequest" },
    ],

    dropDownItems: [],

    defaultRetrieveListItemsRequest: "ExperienceEditor.LagreDropDownItem.GetChildItems",

    dropDownButtonsListClientId: "largeDropDownButtonList",

    initialize: function () {
      this._super();

      this.model.set("datasourceDatabase", this.$el.data("sc-datasourcedatabase"));
      this.model.set("listDataSourceId", this.$el.data("sc-listdatasourceid"));
      this.model.set("defaultListItemCommand", this.$el.data("sc-defaultlistitemcommand"));
      this.model.set("retrieveListItemsRequest", this.$el.data("sc-retrievelistitemsrequest"));
      this.model.set("showIcon", this.$el.data("sc-showicon") == '1');

      if (this.model.get("retrieveListItemsRequest") == "") {
        this.model.set("retrieveListItemsRequest", this.defaultRetrieveListItemsRequest);
      }

      this.model.on("change:isEnabled", this.toggleEnable, this);
      this.model.on("change:isVisible", this.toggleVisible, this);
      this.model.on("change:isPressed", this.togglePressed, this);
      this.model.on("click", this.handleClick, this);
      this.$el.on("click", function (evt) {
        var currentEvent = evt;
        if (!evt) {
          currentEvent = window.event;
        }

        currentEvent.stopPropagation();
      });

      Sitecore.ExperienceEditor.Common.registerDocumentStyles(["/-/speak/v1/ribbon/LargeDropDownButton.css"], window.parent.document);
    },

    handleClick: function () {
      this.closeDropDownButtonList();
      if (this.dropDownItems.length == 0) {
        this.retrieveDropDownItems();
      }

      this.renderDropDownItems(this.dropDownItems);
      window.parent.document.openedDropDownButton = this;
    },

    closeDropDownButtonList: function () {
      var buttonsList = window.parent.document.getElementById(this.dropDownButtonsListClientId);
      if (!buttonsList) {
        return;
      }

      window.parent.document.body.removeChild(buttonsList);
    },


    retrieveDropDownItems: function () {
      var self = this;
      var context = Sitecore.ExperienceEditor.generateDefaultContext();
      context.currentContext.value = this.model.get("datasourceDatabase") + "|" + this.model.get("listDataSourceId");
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor(this.model.get("retrieveListItemsRequest"), function (response) {
        self.dropDownItems = response.responseValue.value;
      }).execute(context);
    },

    getClientRect: function (id) {
      var sourceNode = Sitecore.ExperienceEditor.Common.getElementById(id);
      if (!sourceNode) {
        return null;
      }

      var boundingClientRect = sourceNode.getBoundingClientRect();

      if (boundingClientRect.bottom != 0 && boundingClientRect.left != 0) {
        return boundingClientRect;
      }

      var sourceNodes = document.querySelectorAll('[data-sc-id="' + id + '"]');
      for (var i = 0; i < sourceNodes.length; i++) {
        boundingClientRect = sourceNodes[i].getBoundingClientRect();
        if (boundingClientRect.bottom != 0 && boundingClientRect.left != 0) {
          break;
        }
      }

      return boundingClientRect;
    },

    renderDropDownItems: function (dropDownItemsList) {
      var boundingClientRect = this.getClientRect(this.$el.attr("data-sc-id"));

      var container = window.parent.document.createElement("div");
      var containerStyle = "position:absolute;z-index:10000;top:" + boundingClientRect.bottom + "px;left:" + (boundingClientRect.left + Sitecore.ExperienceEditor.ribbonFrame().offsetLeft) + "px;background-color:#ffffff;";
      container.setAttribute("style", containerStyle);
      container.setAttribute("class", "sc_LargeDropDownButton_DropDownItemsContainer");
      container.setAttribute("id", this.dropDownButtonsListClientId);
      for (var i = 0; i < dropDownItemsList.length; i++) {
        var title = dropDownItemsList[i].Title;
        var itemId = dropDownItemsList[i].ItemId;
        var commandName = this.resolveDropDownItemCommand(itemId);
        if (commandName == "") {
          continue;
        }

        var canSelect = this.checkDropDownCommandCanExecute(itemId, commandName);
        var listItem = window.parent.document.createElement("div");
        listItem.setAttribute("class", "sc_DropDownItem");
        var a = window.parent.document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("title", "");
        a.setAttribute("class", canSelect ? "sc_DropDownItemLink" : "sc_DropDownItemLink_Disabled");
        a.setAttribute("onclick", "document.openedDropDownButton.listItemClick(event, '" + itemId + "', " + canSelect + ", '" + commandName + "')");
        var iconImg = window.parent.document.createElement("img");
        iconImg.setAttribute("class", "sc_DropDownItemImage");
        iconImg.setAttribute("alt", "");
        iconImg.setAttribute("src", dropDownItemsList[i].IconPath);
        var span = window.parent.document.createElement("span");
        span.innerHTML = title;
        span.setAttribute("class", "sc_DropDownItemText");
        if (this.model.get("showIcon")) {
          a.appendChild(iconImg);
        }
        a.appendChild(span);
        listItem.appendChild(a);
        container.appendChild(listItem);
      }

      window.parent.document.addEventListener('click', function () {
        window.parent.document.openedDropDownButton.closeDropDownButtonList();
      }, false);

      document.addEventListener('click', function () {
        window.parent.document.openedDropDownButton.closeDropDownButtonList();
      }, false);

      window.parent.document.body.appendChild(container);
    },

    resolveDropDownItemCommand: function (itemId) {
      var command = Sitecore.ExperienceEditor.CommandsUtil.getCommandByDropDownMenuItemId(itemId);
      if (!command) {
        return this.model.get("defaultListItemCommand");
      }

      return command.commandName;
    },

    checkDropDownCommandCanExecute: function (itemId, commandName) {
      var context = Sitecore.ExperienceEditor.instance.getContext(null);
      context.currentContext.value = itemId;
      return Sitecore.ExperienceEditor.CommandsUtil.runCommandCanExecute(commandName, context);
    },

    listItemClick: function (e, itemId, canSelect, commandName) {
      if (!canSelect) {
        var evt = e;
        if (!evt) {
          evt = window.event;
        }

        evt.stopPropagation();
        return;
      }

      if (itemId == "") {
        return;
      }

      var context = Sitecore.ExperienceEditor.instance.getContext(null);
      context.currentContext.argument = itemId;
      Sitecore.ExperienceEditor.CommandsUtil.runCommandExecute(commandName, context);
    },

    toggleEnable: function () {
      if (!this.model.get("isEnabled")) {
        this.$el.addClass("disabled");
      } else {
        this.$el.removeClass("disabled");
      }
    },

    toggleVisible: function () {
      if (!this.model.get("isVisible")) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
    },

    togglePressed: function () {
      if (this.model.get("isPressed")) {
        this.$el.addClass("pressed");
      } else {
        this.$el.removeClass("pressed");
      }
    },

    setIcon: function (iconSrc) {
      this.$el.find("img:first").attr("src", iconSrc);
      var buttons = $("[data-sc-id='" + this.model.get("name") + "']");
      if (buttons.length > 1) {
        $.each(buttons, function (index, button) {
          $(button).find("img:first").attr("src", iconSrc);
        });
      }
    },
    setLabel: function (label) {
      this.$el.find("span:first").text(label);
      var buttons = $("[data-sc-id='" + this.model.get("name") + "']");
      if (buttons.length > 1) {
        $.each(buttons, function (index, button) {
          $(button).find("span:first").text(label);
        });
      }
    }
  });
});