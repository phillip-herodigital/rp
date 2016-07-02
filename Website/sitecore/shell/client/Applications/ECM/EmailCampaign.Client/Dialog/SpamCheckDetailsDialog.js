define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (_sc) {
  return _sc.Definitions.App.extend({
    initialized: function () {
      _sc.on("spamcheck:details:dialog:show", this.showDialog, this);
      this.on("spamcheck:details:dialog:next", this.next, this);
      this.on("spamcheck:details:dialog:previous", this.previous, this);
    },
    SpamCheckDetails: null,
    showDialog: function (context) {
      this.SpamCheckDetails = context;
      this.SpamCheckDetailsDialog.show();
      this.setValue(this.SpamCheckDetails.name, this.SpamCheckDetails.title, this.SpamCheckDetails.body);
      this.SpamCheckDetails.list = [];

      var that = this;
      var root = $("div.sc-spamcheckresult[data-sc-variant-id='" + this.SpamCheckDetails.variantId + "']");
      $.each($("div.sc-report-item a", root), function (k, v) {
        var item = $(v);
        if (item.data("sc-title") != "") {
          that.SpamCheckDetails.list.push({
            name: item.data("sc-name"),
            title: item.data("sc-title"),
            body: item.data("sc-body")
          });
        }
      });

      if (this.SpamCheckDetails.list.length == 1) {
        this.SpamCheckDetailsDialogNextButton.viewModel.hide();
        this.SpamCheckDetailsDialogPreviousButton.viewModel.hide();
      } else {
        this.SpamCheckDetailsDialogNextButton.viewModel.show();
        this.SpamCheckDetailsDialogPreviousButton.viewModel.show();
      }
    },
    next: function () {

      var currentItem = this.SpamCheckNameText.get("text");
      var currentIndex;
      $.each(this.SpamCheckDetails.list, function (k, v) {
        if (v.name == currentItem) {
          currentIndex = k;
        }
      });

      if (currentIndex + 1 >= this.SpamCheckDetails.list.length) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }

      this.setValue(this.SpamCheckDetails.list[currentIndex].name, this.SpamCheckDetails.list[currentIndex].title, this.SpamCheckDetails.list[currentIndex].body);
    },
    previous: function () {
      var currentItem = this.SpamCheckNameText.get("text");
      var currentIndex;
      $.each(this.SpamCheckDetails.list, function (k, v) {
        if (v.name == currentItem) {
          currentIndex = k;
        }
      });

      if (currentIndex - 1 < 0) {
        currentIndex = this.SpamCheckDetails.list.length - 1;
      } else {
        currentIndex--;
      }

      this.setValue(this.SpamCheckDetails.list[currentIndex].name, this.SpamCheckDetails.list[currentIndex].title, this.SpamCheckDetails.list[currentIndex].body);
    },
    hideDialog: function () {
      this.EmailPreviewDetailsDialog.hide();
    },
    setValue: function (name, title, body) {
      this.SpamCheckNameText.set("text", name);
      this.SpamCheckDetailsText.set("text", body);
      this.SpamCheckTitleText.set("text", title);

      this.SpamCheckDetailsDialog.viewModel.$el.find(".sc-dialogWindow-header-title").text(name);
    }
  });
});
