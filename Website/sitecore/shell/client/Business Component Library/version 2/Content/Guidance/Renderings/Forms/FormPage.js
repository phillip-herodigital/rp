(function(speak) {
  speak.pageCode([],function() {
    return {
  
      showFormData: function () {
        alert(JSON.stringify(this.Form.getFormData()));
      },
    };
  }, "SubAppRenderer");
})(Sitecore.Speak);