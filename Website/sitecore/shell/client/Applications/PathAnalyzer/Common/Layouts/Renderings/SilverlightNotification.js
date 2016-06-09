define(["sitecore"], function (Sitecore) {
  Sitecore.Factories.createBaseComponent({
    name: "SilverlightNotification",
    base: "ControlBase",
    selector: ".sc-SilverlightNotification",
    cookiePrefix: "scSilverlightNotification_",
    attributes: [
    ],

    initialize: function () {
      this.$el.find('.sc-dialogWindow-buttons button').click(function () {
        var elem = $(this);
        var dialogContainer = elem.closest('.sc-dialogWindow');
        dialogContainer.modal("hide");
      });
    },

    afterRender: function () {
      var ua = navigator.userAgent.toLowerCase();
      var isChrome = ua.indexOf('chrome') !== -1;
      var isEdge = ua.indexOf('edge') !== -1;
      if ((isChrome || isEdge) && this.getCookieValue("showNotification") !== "false") {
        this.showModalDialog();
      }
    },

    showModalDialog: function () {
      var dialogContainer = this.$el.find(".sc-dialogWindow");

      var dialogFrame = dialogContainer.find(".sc-dialogWindow-body iframe");
      if (!dialogFrame) {
        return;
      }

      dialogContainer.data("width", "500");
      dialogContainer.data("height", "150");

      dialogContainer.modal("show");
      this.setCookieValue("showNotification", "false");
    },

    setCookieValue: function (name, value) {
      document.cookie = this.cookiePrefix + name + "=" + value + ";path=/;";
    },

    getCookieValue: function(name) {
      var cname = this.cookiePrefix + name,
       cookie = document.cookie,
       cookieArray = cookie.split(";");

      for (var i = 0; i < cookieArray.length; i++) {
        var cookieItem = cookieArray[i].trim().split("=");

        if (cookieItem[0] === cname) {
          return cookieItem[1];
        }
      }

      return null;
    }
  });
});
