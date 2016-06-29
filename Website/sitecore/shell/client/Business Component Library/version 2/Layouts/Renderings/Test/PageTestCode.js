(function (speak, requirejs) {
  speak.component({
    name: "PageTestCode",
    initialize: function () {
      this.defineProperty("Status", "Speak Loading.");
      this.NumberClick = 0;
    },
    initialized: function () {
      //TODO: update bootJS to latests SPEAK Events
      var self = this;
      speak.on("apps:loaded", function () {
        self.appendStatus("Speak Loaded.");
        self.appendStatus("Fetch File: " + self.SpecFiles + ".");

        requirejs([self.SpecFiles], function () {
          self.appendStatus("Executing Test.");
          window.onload();
          self.appendStatus("Test Executed.");
        });
      });

      document.getElementById("test-dom").classList.toggle("offcanvas", this.HideComponents);
    },
    appendStatus: function (str) {
      this.Status += ("<br/>" + str);
    },
    testingClick: function () {
      this.NumberClick += 1;
    }
  });
})(Sitecore.Speak, requirejs);