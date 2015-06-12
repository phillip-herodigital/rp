define(["sitecore"], function (sitecore) {
  var messageVariant = sitecore.Definitions.App.extend({
    initialized: function () {
      var letter = this.ReportVariantNameText.get("text");
      var element = this.ReportVariantAccordion.viewModel.$el.children(".sc-advancedExpander-header").find(".sc-advancedExpander-header-title-text");
      var existingLetterElem = $(element).find(".abn-letter");
      if (existingLetterElem.length > 0) {
        $(existingLetterElem).html(letter);
      } else {
        var letterElem = "<span class='abn-letter'>" + letter + "</span>";
        $(element).html($(element).html() + letterElem);
      }
    }
  });

  return messageVariant;
});