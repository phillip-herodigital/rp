require.config({
    paths: {
        jqueryMouseWheel: "lib/ui/deps/CustomScrollbar/jquery.mousewheel.min",
        scrollPlugin: "lib/ui/deps/CustomScrollbar/jquery.mCustomScrollbar",
        scrollCSS: "lib/ui/deps/CustomScrollbar/jquery.mCustomScrollbar"
    },
    shim: {
        'scrollPlugin': { deps: ['jqueryMouseWheel'] },
        'jqueryMouseWheel': { deps: ['jqueryui'] }
    }
});

define("Scrollbar", ["sitecore", "jqueryMouseWheel", "scrollPlugin", "css!scrollCSS"], function (_sc) {
    _sc.Factories.createBehavior("Scrollbar", {
        beforeRender: function () {
            this.on("didRender", this.update, this);
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
              appendScrollTo.mCustomScrollbar();
              this.model.get("view") == "DetailList" ? appendScrollTo.find(".mCustomScrollBox").css({ "position": "initial" }) : $.noop();
            }
        }
    });
}); 