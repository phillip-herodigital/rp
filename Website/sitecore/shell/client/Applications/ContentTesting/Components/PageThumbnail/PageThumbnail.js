var imageThumbsPath;
var requestUtilPath;
if (window.location.host && window.location.host != '') { // launching when address to web-page
  imageThumbsPath = "/-/speak/v1/contenttesting/ImageThumbs.js";
  requestUtilPath = "/-/speak/v1/contenttesting/RequestUtil.js";
}
else { // launching of the code-coverage estemating
  require.config({
    paths: {
      imageThumbsPath: contentTestingDir + "/Common/lib/imagethumbs",
      requestUtilPath: contentTestingDir + "/Common/lib/RequestUtil",
    },
  });
  imageThumbsPath = "imageThumbsPath";
  requestUtilPath = "requestUtilPath";
}

define(["sitecore", imageThumbsPath, requestUtilPath], function (Sitecore, thumbs, requestUtil) {
  var getBaseUrl = function () {
    var topwindow = window;
    var limitCounter = 0;
    while (topwindow.location.href != topwindow.parent.location.href && limitCounter < 10) {
      topwindow = topwindow.parent;
      limitCounter++;
    }

    return topwindow.location.href;
  };

  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set({
        isBusy: false,
        invalidated: false,
        actionUrl: null,
        startGetThumbnailUrl: "/sitecore/shell/api/ct/TestThumbnails/StartGetThumbnails",
        tryFinishGetThumbnailUrl: "/sitecore/shell/api/ct/TestThumbnails/TryFinishGetThumbnails",
        itemId: null,
        language: null,
        version: 0,
        revision: null,
        combination: null,
        testvalueid: null,
        imgSrc: null,
        previewUrl: null,
        showLink: false,
        linkTarget: "_top",
        baseLinkUrl: getBaseUrl()
      });

      this.on("change:itemId change:version change:language change:revision change:combination change:testvalueid", this.refresh, this);
      this.on("change:combination change:baseLinkUrl", this.updateLink, this);
    },

    updateLink: function()
    {
      var comb = this.get("combination");
      var base = this.get("baseLinkUrl");
      var url = Sitecore.Helpers.url.addQueryParameters(base, { sc_combination: comb }); // todo: Skynet: Is there a safer way to interact with the parent?
      this.set("previewUrl", url);
    },

    refresh: function () {
      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      var id = this.get("itemId") || params.id;
      var comb = this.get("combination");
      var version = this.get("version") || params.vs;
      var language = this.get("language") || params.la;
      var rule = this.get("testvalueid");

      if (!id) {
        return;
      }

      if (typeof this.viewModel.$el != 'undefined') {
        this.set("isBusy", true);
      }
      this.set("invalidated", false);

      var data = {
        attrs: {
          id: id,
          version: version,
          language: language,
          combination: comb,
          revision: this.get("revision"),
          rules: rule || ""
        }
      };

      var url = this.get("getThumbnailUrl");
      var startUrl = this.get("startGetThumbnailUrl");
      var endUrl = this.get("tryFinishGetThumbnailUrl");
      var imageThumbs = new thumbs.ImageThumbs();

      var self = this;

      var itemCallback = function (id, el, src) {
        self.set("imgSrc", src);
      };

      var finishCallback = function () {
        self.set("isBusy", false);
      };

      if (url) {
        imageThumbs.populateImages([data], null, url, itemCallback, finishCallback);
      }
      else if (startUrl && endUrl) {
        imageThumbs.populateImages([data], null, startUrl, endUrl, itemCallback, finishCallback);
      }
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {

      this.model.set("isBusy", true);

      this.model.set({
        itemId: this.$el.attr("data-sc-itemid") || null,
        language: this.$el.attr("data-sc-language") || null,
        version: this.$el.attr("data-sc-version") || 0,
        revision: this.$el.attr("data-sc-revision") || null,
        combination: this.$el.attr("data-sc-combination") || null,
        testvalueid: this.$el.attr("data-sc-testvalueid") || null,
        showLink: this.$el.attr("data-sc-showlink") === "true", // todo: add version
        baseLinkUrl: this.$el.attr("data-sc-baselinkurl") || getBaseUrl(),
        linkTarget: this.$el.attr("data-sc-linktarget") || "_top",
        isBusy: this.$el.attr("data-sc-isbusy") == "true" || false
      });

      this.model.on("change:imgSrc", this.refresh, this);
      this.model.on("change:isBusy", this.setState, this);

      this.model.refresh();
    },

    refresh: function () {
      this.$el.find("img").remove();
      this.$el.prepend("<img height=\"100%\" src=\"" + this.model.get("imgSrc") + "\"/>");      
    },

    setState: function () {
      if (this.model.get("isBusy")) {
        this.$el.removeClass("blank");
      } else {
        if (this.model.get("imgSrc") === "") {
          this.$el.addClass("blank");
        }
      }
    }
  });

  Sitecore.Factories.createComponent("ThumbnailImage", model, view, ".sc-ThumbnailImage");
});
