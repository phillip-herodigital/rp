define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (_sc) {
  return _sc.Definitions.App.extend({
    initialized: function () {
      _sc.on("emailpreview:details:dialog:show", this.showDialog, this);
      this.on("emailpreview:details:dialog:next", this.next, this);
      this.on("emailpreview:details:dialog:previous", this.previous, this);
    },
    PreviewDetails: null,
    showDialog: function (context) {
      this.PreviewDetails = context;
      this.EmailPreviewDetailsDialog.show();
      this.setUrlAndTitle(this.PreviewDetails.url, this.PreviewDetails.name);

      this.PreviewDetails.list = [];

      var that = this;
      var root = $("div.sc-emailpreviewresult[data-sc-variant-id='" + this.PreviewDetails.variantId + "']");
      $.each($("div.sc-report-item a", root), function (k, v) {
        var item = $(v);
        if (item.data("sc-url") != "") {
          that.PreviewDetails.list.push({
            name: item.data("sc-name"),
            url: item.data("sc-url")
          });
        }
      });

      if (this.PreviewDetails.list.length == 1) {
        this.EmailPreviewDetailsDialogNextButton.viewModel.hide();
        this.EmailPreviewDetailsDialogPreviousButton.viewModel.hide();
      } else {
        this.EmailPreviewDetailsDialogNextButton.viewModel.show();
        this.EmailPreviewDetailsDialogPreviousButton.viewModel.show();
      }
    },
    next: function () {
      var currentUrl = this.EmailPreviewImage.get("imageUrl");
      var currentIndex;
      $.each(this.PreviewDetails.list, function (k, v) {
        if (v.url == currentUrl) {
          currentIndex = k;
        }
      });

      if (currentIndex + 1 >= this.PreviewDetails.list.length) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }

      this.setUrlAndTitle(this.PreviewDetails.list[currentIndex].url, this.PreviewDetails.list[currentIndex].name);
    },
    previous: function () {
      var currentUrl = this.EmailPreviewImage.get("imageUrl");
      var currentIndex;
      $.each(this.PreviewDetails.list, function (k, v) {
        if (v.url == currentUrl) {
          currentIndex = k;
        }
      });

      if (currentIndex - 1 < 0) {
        currentIndex = this.PreviewDetails.list.length - 1;
      } else {
        currentIndex--;
      }

      this.setUrlAndTitle(this.PreviewDetails.list[currentIndex].url, this.PreviewDetails.list[currentIndex].name);
    },
    hideDialog: function () {
      this.EmailPreviewDetailsDialog.hide();
    },
    setUrlAndTitle: function (url, title) {
      this.EmailPreviewImage.set("imageUrl", url);
      var clientSpan = this.EmailPreviewDetailsDialog.viewModel.$el.find(".sc-dialogWindow-header-title-client");
      if (clientSpan.length == 0) {
        this.EmailPreviewDetailsDialog.viewModel.$el.find(".sc-dialogWindow-header-title").prepend('<span class="sc-dialogWindow-header-title-client">' + title + '</span>');
      } else {
        clientSpan.text(title);
      }
    }

  });
});
