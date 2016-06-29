(function (Speak) {
  require.config({
    paths: {
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection"
    }
  });

  Speak.component(["collection"], function (Collection) {

    var temporaryNotificationTimeout,
      createItems = function (hookEvent) {
        var newData = hookEvent.data.map(createViewModelItems, this);
        newData = sortDataByType.call(this, newData);

        // When only one message remains, the header dissapears which is why we want to reset the state at that point.
        if (newData.length <= 1) {
          this.IsOpen = false;
        }
        hookEvent.result(newData);

        this.Severity = (newData.length ? newData[0].Type : "");
        this.TotalMessageCount = this.getNumOfItems();
        this.HasMessages = this.TotalMessageCount > 0;
        this.HeadText = getHeadText.call(this, newData);

        addTemporary.call(this);
      },

      addTemporary = function () {
        clearTimeout(temporaryNotificationTimeout);
        if (this.TotalMessageCount === 1 && this.Items[0].Type === "notification" && this.Items[0].IsTemporary) {
          temporaryNotificationTimeout = window.setTimeout(_.bind(function () {
            this.reset();
          }, this), 10000);
        }
      },

      getHeadText = function () {
        var text = [];
        this.HasErrorMessages && text.push(this.Translations.Errors);
        this.HasWarningMessages && text.push(this.Translations.Warnings);
        this.HasNotificationMessages && text.push(this.Translations.Notifications);
        return this.Translations.ThereAre + " " + text.join(", ") + ".";
      },

      sortDataByType = function (newData) {
        var errors = newData.filter(function (item) { return item.Type === "error"; }),
          warnings = newData.filter(function (item) { return item.Type === "warning"; }),
          notifications = newData.filter(function (item) { return item.Type === "notification"; });

        this.HasErrorMessages = errors.length !== 0;
        this.HasNotificationMessages = notifications.length !== 0;
        this.HasWarningMessages = warnings.length !== 0;

        return [].concat(errors, warnings, notifications);
      },

      createViewModelItems = function (item, index) {
        
        return {
          Type: item.Type ? item.Type.toLowerCase() : "notification",
          Actions: item.Actions || [],
          Text: item.Text || "",
          IsClosable: item.IsClosable || (item.IsTemporary && this.getNumOfItems() > 1),
          Index: index,
          IsTemporary: item.IsTemporary || false
        };
      };

    return Speak.extend({}, Collection.prototype, {
      initialized: function () {

        this.defineProperty("Severity", "");
        this.defineProperty("HeadText", "");
        this.defineProperty("IsOpen", false);
        this.Translations = JSON.parse(this.Translations);

        //Add click handlers
        var that = this,
          app = that.app;

        $(this.el).on("click", ".sc-messageBar-actionLink", function () {
          var clickInvocation = $(this).attr("data-sc-click");
          if (clickInvocation) {
            return Speak.Helpers.invocation.execute(clickInvocation, { app: app });
          }
          return null;
        });
   
        $(this.el).on("click", "button.close", function () {
          var clickedItemIndex = $(this).attr("index");
          that.removeAt(clickedItemIndex);
        });

        this.on("hook:Items", createItems, this);
        Collection.prototype.initialized.call(this);
      },

      toggle: function() {
        this.IsOpen = !this.IsOpen;
      }

    });
  }, "MessageBar");

})(Sitecore.Speak);