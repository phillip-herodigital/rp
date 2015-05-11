require.config({
    paths: {
        jqueryMouseWheel: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/CustomScrollbar/jquery.mousewheel.min",
        scrollPlugin: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/CustomScrollbar/jquery.mCustomScrollbar",
        scrollCSS: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/CustomScrollbar/jquery.mCustomScrollbar"
    },
    shim: {
        'scrollPlugin': { deps: ['jqueryMouseWheel'] },
        'jqueryMouseWheel': { deps: ['jqueryui'] }
    }
});

define( ["sitecore", "jqueryMouseWheel", "scrollPlugin", "css!scrollCSS"], function (_sc) {
    _sc.Factories.createBehavior("Scrollbar", {
        beforeRender: function () {
          var that = this;
          
          this.on("didRender", this.update, this);
          
          // Applies the custom scrollbar after the DialogWindow render, if it is put inside a DialogWindow component
          if (this.$el.parents(".sc-dialogWindow").length) {
            this.$el.parents(".sc-dialogWindow").on("shown.bs.modal", function () {
              that.update();
            });
          }
        },
        update: function () {
            this.$el.mCustomScrollbar("update");
        },
        afterRender: function () {
          this.enableScroll();         
        },
        enableScroll: function () {
            var scroll = this.$el.find(".totalScrollOffset");
            if (scroll.length === 0) {
              var insertTheScrollArea = '<div style="height:0px;" class="totalScrollOffset"></div>',
                  appendScrollTo = this.model.get("view") == "DetailList" ? this.$el.find(".sc-listcontrol-body") : this.$el;
              appendScrollTo.height(this.model.get("height"));
              appendScrollTo.css({
                    position: "relative"
                });
              appendScrollTo.append(insertTheScrollArea);
              appendScrollTo.mCustomScrollbar({
                advanced: {
                  updateOnContentResize: true
                }
              });
              this.model.get("view") == "DetailList" ? appendScrollTo.find(".mCustomScrollBox").css({ "position": "initial" }) : $.noop();
            }
        }
    });
}); 