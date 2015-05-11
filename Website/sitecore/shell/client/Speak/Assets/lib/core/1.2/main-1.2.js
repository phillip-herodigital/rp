(function (global) {
  require.config({
    baseUrl: "/",
    paths: {
      Sitecore: "/sitecore/shell/client/Speak/Assets/lib/core/1.2/sitecore",
      handlebars: "/sitecore/shell/client/Speak/Assets/lib/core/1.2/deps/handlebars-v1.3.0",
      scPipeline: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/scPipeline",
      scSpeakObservableArray: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/scSpeakObservableArray",
      scSpeakPresenter: "/sitecore/shell/client/Speak/Assets/lib/core/1.2/deps/scSpeakPresenter",
      scKoPresenter: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/scKoPresenter",
      knockout: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/deps/knockout-3.0.0",
      underscore: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/deps/underscore.1.6.0",
      backbone: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/deps/backbone.1.1.1",
      jquery: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/deps/jquery-2.1.0",
      bootstrap: "/sitecore/shell/client/Speak/Assets/lib/ui/1.2/deps/bootstrap",
      //backward compatibility
      jqueryui: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jQueryUI/jquery-ui-1.10.1.custom"
    },
    shim: {
      "Sitecore": { deps: ['handlebars'] },
      "bootstrap": { deps: ['jquery'] },
      "knockout": { exports: "ko" },
      "jquery": { exports: "jQuery" },
      "underscore": { exports: "_" },
      "backbone": { deps: ["jquery", "underscore"], exports: "Backbone" },
      "scKoPresenter": { deps: ["sitecore", "knockout"] },
      "scPipeline": { deps: ["sitecore"] },
      "scSpeakPresenter": { deps: ["knockout", "backbone", "underscore", "jquery"] },
      "jqueryui": { deps: ["jquery"] },
      "sitecore": { deps: ["Sitecore"] }
    },
    map: {
      "*": {
        "css": "/sitecore/shell/client/Speak/Assets/lib/core/1.2/deps/css.js"
      }
    }
  });

  //backward compatibility
  define("sitecore", function () {
    return window.Sitecore.Speak;
  });

  require(["Sitecore", "scSpeakPresenter"], function (Sitecore) {
    Sitecore.init();
  });
})(this);
