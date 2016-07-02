define(["jquery", "sitecore"], function ($, sitecore) {
    sitecore.Factories.createBaseComponent({
    name: "CreateMessage",
    base: "ControlBase",
    selector: ".sc-createmessage",
    attributes: [
      { name: "dataSourceValue", defaultValue: null },
      { name: "messageType", value: "$el.data:sc-messagetype" },
      { name: "noContentMessage", value: "$el.data:sc-emptycontentmessage" }
    ],
    events:
    {
      "click .sc-createmessage-item": "onClickCreateMessageItem",
      "click .sc-createmessage-folder": "onClickCreateMessageItemFolder",
      "click .sc-goback": "onClickGoBack",
      "click .sc-createmessage-existingpage": "onClickExistingPage",
      "click .sc-createmessage-existingtemplate": "onClickExistingTemplate",
      "click .sc-createmessage-importhtml": "onClickimporthtml"
    },

    initialize: function() {
      this._super();
      this.model.on("change:dataSourceValue", this.onDataSourceChanged, this);
      $("[data-sc-id=UploaderRowPanel]").hide();
      $("[data-sc-id=UploaderSpaceBorder]").hide();
    },

    setActiveOption: function(event) {
      $(".sc-createmessage-option").removeClass("active");
      if (!event.target) {
        return;
      }
      $(event.target).closest(".sc-createmessage-option").addClass("active");
    },

    onClickCreateMessageItem: function (event) {
      var parameters = this.get(event.target, "sc-messageparameters");
      var url = this.get(event.target, "sc-messageurl");
      sitecore.trigger("create:message:click", { parameters: parameters, url: url, app: this.app });
    },

    onClickExistingPage: function (event) {
      this.app.NameLabel.set("isVisible", false);
      this.app.NameTextBox.set("isVisible", false);

      this.app.ImportNameLabel.set("isVisible", true);
      this.app.ImportNameTextBox.set("isVisible", true);

      this.app.BrowseNameLabel.set("isVisible", true);
      this.app.BrowseTextBox.set("isVisible", true);


      this.app.UploaderInfo.set("isVisible", false);
      this.app.Uploader.set("isVisible", false);

      $("[data-sc-id=UploaderRowPanel]").hide();
      $("[data-sc-id=UploaderSpaceBorder]").hide();
      this.setActiveOption(event);
    },

    onClickExistingTemplate: function (event) {
      this.app.NameLabel.set("isVisible", true);
      this.app.NameTextBox.set("isVisible", true);

      this.app.ImportNameLabel.set("isVisible", false);
      this.app.ImportNameTextBox.set("isVisible", false);

      this.app.BrowseNameLabel.set("isVisible", false);
      this.app.BrowseTextBox.set("isVisible", false);
      $("[data-sc-id=UploaderRowPanel]").hide();
     
      this.app.UploaderInfo.set("isVisible", false);
      this.app.Uploader.set("isVisible", false);

      var nameTextBoxViewModel = this.app.NameTextBox.viewModel;
      nameTextBoxViewModel.focus();

      $("[data-sc-id=UploaderRowPanel]").hide();
      $("[data-sc-id=UploaderSpaceBorder]").hide();
      this.setActiveOption(event);
    },


    onClickimporthtml: function (event) {
      this.app.NameLabel.set("isVisible", false);
      this.app.NameTextBox.set("isVisible", false);

      this.app.ImportNameLabel.set("isVisible", true);
      this.app.ImportNameTextBox.set("isVisible", true);

      this.app.BrowseNameLabel.set("isVisible", false);
      this.app.BrowseTextBox.set("isVisible", false);

      $("[data-sc-id=UploaderRowPanel]").show();
      $("[data-sc-id=UploaderSpaceBorder]").show();
      this.setActiveOption(event);
    },

    onClickCreateMessageItemFolder: function (event) {
      var sectionIndex = this.get(event.target, "sc-messageparameters");
      if (typeof sectionIndex !== "undefined") {
        event.currentTarget.parentElement.style.display = "none";
        var className = "." + sectionIndex;
        $(className).show();
      }
    },

    onClickGoBack: function (event) {
			var sectionIndex = this.get(event.target, "sc-messageparameters");
			if (typeof sectionIndex !== "undefined") {
				event.currentTarget.parentElement.parentElement.style.display = "none";
				var className = "." + sectionIndex;
				$(className).show();
			}
		},

    get: function(target, attributeName) {
      if (target === undefined || target === null)
        return undefined;
      var id = $(target).data(attributeName);
      if (id === undefined)
        id = this.get(target.parentNode, attributeName);
      return id;
    },

    renderDataSource: function () {
      var contextApp = this;
      var messageType = contextApp.model.get("messageType");
      var dataSourceValue = contextApp.model.get("dataSourceValue");

      var createMessageOptions = [];
      var createMessageSections = [];

      _.each(dataSourceValue, function (item) {
        if (item.messageType === messageType) {
          createMessageOptions.push(item);
          var section = item.section;
          if (contextApp.hasCreateMessageSectionAdded(section, createMessageSections) === false) {
            createMessageSections.push(section);
          }
        }
      }, contextApp);

      createMessageSections.sort(function (a, b) { return a.index - b.index; });

      var renderModel = contextApp.createRenderModel(createMessageSections, createMessageOptions, contextApp);

      contextApp.renderCreateOptions(renderModel, contextApp);
    },

    hasCreateMessageSectionAdded: function(section, sectionArray) {
      if (section === undefined || sectionArray === null || !(sectionArray instanceof Array))
        return undefined;
      var hasFound = false;
	    _.each(sectionArray, function(item) {
		    if (item.name === section.name) {
			    hasFound = true;
			    return false;
		    }
	    }, this);
      if (hasFound) {
        return true;
      } else {
        return false;
      }
    },

    createRenderModel: function(createMessageSections, createMessageOptions, contextApp) {
      var renderModel = [];
      _.each(createMessageSections, function(section) {
        var options = [];
        _.each(createMessageOptions, function(option) {
          if (option.section.name === section.name) {
            options.push(option);
          }
        }, contextApp);
        options.sort(function(a, b) { return a.sectionIndex - b.sectionIndex; });
        renderModel.push({ key: section, value: options });
      }, contextApp);
      return renderModel;
    },

    renderCreateOptions: function(renderModel, contextApp) {
      var rootDiv = this.$el.find(".sc-message-thumbnails");
      rootDiv.empty();

      if (renderModel.length == 0) {
        rootDiv.append(contextApp.model.get("noContentMessage") || "");
      } else {
        _.each(renderModel, function (section) {
          var sectionIndex = -1;
          var htmlToAppend = "<div class='sc-createmessage-section row-fluid  sc-show-padding " + sectionIndex + "'><h3>" + section.key.name + "</h3>";
          _.each(section.value, function (option) {
            if (option.visible === true) {
              htmlToAppend += contextApp.renderCreateOption(option, sectionIndex, rootDiv, contextApp);
            }
          }, contextApp);
          htmlToAppend += "</div></br></br>";

          rootDiv.append(htmlToAppend);
        }, contextApp);
      }
    },

    renderCreateOptionsFolder: function (option, parentSectionIndex, rootDiv, contextApp) {
      var htmlToAppend = "<div class='sc-createmessage-section row-fluid  sc-show-padding " + option.sectionIndex + "' style='display: none'><h3><span title='back' class='sc-goback' data-sc-messageparameters='" + parentSectionIndex + "'><img src='/~/media/A0C408E4BBBF42CFAD87683F4DB2E494.ashx?sc_database=core' alt='Back' style='cursor: pointer'/></span> " + option.name + "</h3>";
	    _.each(option.children, function(child) {
	        htmlToAppend += contextApp.renderCreateOption(child, parentSectionIndex, rootDiv, contextApp);
	    });
	    htmlToAppend += "</div>";
        return htmlToAppend;
    },

    renderCreateOption: function (option, sectionIndex, rootDiv, contextApp) {
        var htmlToAppend = "";

        if (option.children) {
            htmlToAppend += "<div title='" + option.name + "' class='sc-createmessage-folder sc-createmessage-option' data-sc-messageparameters='" + option.sectionIndex + "'>";
            rootDiv.append(contextApp.renderCreateOptionsFolder(option, sectionIndex, rootDiv, contextApp));
        } else {
            switch (option.CreateType) {
                case 1:
                    htmlToAppend += "<div title='" + option.name + "' class='sc-createmessage-item sc-createmessage-option sc-createmessage-existingpage' data-sc-messageparameters='" + option.parameters + "' data-sc-messageurl='" + option.url + "'>";
                    break;
                case 2:
                    htmlToAppend += "<div title='" + option.name + "' class='sc-createmessage-item sc-createmessage-option sc-createmessage-existingtemplate' data-sc-messageparameters='" + option.parameters + "' data-sc-messageurl='" + option.url + "'>";
                    break;
                case 3:
                    htmlToAppend += "<div title='" + option.name + "' class='sc-createmessage-item sc-createmessage-option sc-createmessage-importdesigner' data-sc-messageparameters='" + option.parameters + "' data-sc-messageurl='" + option.url + "'>";
                    break;
                case 4:
                    htmlToAppend += "<div title='" + option.name + "' class='sc-createmessage-item sc-createmessage-option sc-createmessage-importhtml' data-sc-messageparameters='" + option.parameters + "' data-sc-messageurl='" + option.url + "'>";
                    break;
                default:
                    htmlToAppend += "<div title='" + option.name + "' class='sc-createmessage-item sc-createmessage-option' data-sc-messageparameters='" + option.parameters + "' data-sc-messageurl='" + option.url + "'>";
                    break;
            }
        }

        htmlToAppend += "<div class='icon'>";
        htmlToAppend += "<img src='" + option.iconUrl.replace("bc=White", "bc=Transparent") + "' alt='" + option.name + "'>";
        htmlToAppend += "</div>";
        htmlToAppend += "<div class='name'>" + option.name + "</div>";
        htmlToAppend += "</div>";

        return htmlToAppend;
    }
  });
});