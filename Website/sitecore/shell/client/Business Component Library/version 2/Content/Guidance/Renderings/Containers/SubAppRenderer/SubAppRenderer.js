(function (speak) {
  speak.pageCode([],function() {
    return {
      initialized: function() {
        this.Text2.Text = "This text is added at client side by the JS file defined in the SubAppLayout.SubPageCode.PageCodeScriptFileName.";       
      },
    };
  }, "SubAppRenderer1");
})(Sitecore.Speak);