define(["sitecore"], function (sitecore) {
  var messageVariant = sitecore.Definitions.App.extend({
    initialized: function () {
      var context = this;
      context.initVariant(context);
      context.bodyUrl = context.BodyFrame.get("sourceUrl");
      
      context.on("action:addvariant", function () {
        sitecore.trigger("action:abtesting:variant:add", context);
        sitecore.trigger("change:messageContext", this);
      }, context);

      context.on("action:duplicatevariant", function () {
        sitecore.trigger("action:abtesting:variant:duplicate", { variant: context });
        sitecore.trigger("change:messageContext", this);
      }, context);

      context.on("action:removevariant", function () {
        sitecore.trigger("action:abtesting:variant:remove", { variant: context });
        sitecore.trigger("change:messageContext", this);
      }, context);

      context.SubjectTextBox.on("change:text", function () {
        sitecore.trigger("change:variantsubject", { variant: context });
        sitecore.trigger("change:messageContext", this);
      }, context);

      context.AlternativeTextArea.on("change:text", function () {
        sitecore.trigger("change:variantalternativetext", { variant: context });
        sitecore.trigger("change:messageContext", this);
      }, context);

      context.on("action:sendquicktest", function () {
        sitecore.trigger("action:switchtab", { tab: 3, subtab: 0 });
      }, context);

      context.on("action:seeabtestresults", function () {
        sitecore.trigger("action:switchtab", { tab: 4 });
      }, context);

      context.on("action:insertpersonalizationtoken", function () {
        sitecore.trigger("action:messagecontent:insertpersonalizationtoken");
        sitecore.trigger("change:messageContext", this);
      }, context);

      context.on("action:editmessagevariantcontent", function () {
        sitecore.trigger("action:messagevariantcontent:editcontent", context);
        sitecore.trigger("change:messageContext", this);
      }, context);

      sitecore.on("change:personalizationRecipientId", function (recipientId) {
        var url = context.bodyUrl;

        if (recipientId) {
          url += "&recipient=" + recipientId;
        }

        context.BodyFrame.set("sourceUrl", url);
      });
    },

    initVariant: function (context) {
      var isMouseOverFrame = false;

      window.addEventListener('blur', function () {
        if (isMouseOverFrame) {
          sitecore.trigger("action:messagevariantcontent:editcontent", context);
          sitecore.trigger("change:messageContext", this);
        }
      });

      var frame = context.BodyFrame.viewModel.$el;

      $(frame).bind('mouseenter', function () {
        isMouseOverFrame = true;
      });

      $(frame).bind('mouseleave', function () {
        isMouseOverFrame = false;
      });
    }
  });

  return messageVariant;
});