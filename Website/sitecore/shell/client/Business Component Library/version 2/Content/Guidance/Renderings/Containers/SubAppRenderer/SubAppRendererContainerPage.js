(function (speak) {
  speak.pageCode(function () {
    return {
      initialized: function () {
         this.SubAppRenderer1.Text3.Text = "This text is added at client side by the JS file defined in the SunAppRendererPage.PageCode.PageCodeScriptFileName";
      }
    };
});
}(Sitecore.Speak));