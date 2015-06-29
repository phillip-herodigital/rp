define(["sitecore", "css!/sitecore/shell/client/applications/listmanager/navigation/navigationmenu.css"], function (_sc) {
  var App = _sc.Definitions.App.extend({
    initialized: function () {
      this.addClickToBorder(this.ImportNewContactsBorder);
      this.addClickToBorder(this.CreateListsBorder);
    },
    addClickToBorder: function(border) {
      border.viewModel.$el.find("> div").css('cursor', 'pointer').on("click", function () {
        $(this).find(".sc-hyperlinkbutton")[0].click();
      });
      border.viewModel.$el.find(".sc-hyperlinkbutton").on("click", function (event) {
        event.stopPropagation();
      });
    }
  });
  return App;
});