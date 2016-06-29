(function (global) {
  require.config({
    //baseUrl: "/",
    paths: {
      Sitecore: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/sitecore",
      HandlebarsLib: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/deps/handlebars",
      scPipeline: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/scPipeline",
      scSpeakObservableArray: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/scSpeakObservableArray",
      scSpeakPresenter: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/deps/scSpeakPresenter",
      scKoPresenter: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/scKoPresenter",
      knockout: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/deps/knockout-3.0.0",
      underscore: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/deps/underscore.1.6.0",
      backbone: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/deps/backbone.1.1.1",
      jquery: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/deps/jquery-2.1.1",
      bootstrap: "/sitecore/shell/client/Speak/Assets/lib/ui/2.0/deps/bootstrap",
      performance: "/sitecore/shell/client/Speak/Assets/lib/core/2.0/deps/performance",
      //backward compatibility
      jqueryui: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/jQueryUI/jquery-ui-1.10.1.custom"
    },
    shim: {
      "handlebars": {deps: ['HandlebarsLib']},
      "Sitecore": { deps: ['handlebars'] },
      "bootstrap": { deps: ['jquery'] },
      "knockout": { exports: "ko" },
      "jquery": { exports: "jQuery" },
      "underscore": { exports: "_" },
      "backbone": { deps: ["jquery", "underscore"], exports: "Backbone" },
      "scKoPresenter": { deps: ["sitecore", "knockout"] },
      "scPipeline": { deps: ["sitecore"] },
      "scSpeakPresenter": { deps: ["knockout", "backbone", "underscore", "jquery", "Sitecore"] },
      "jqueryui": { deps: ["jquery"] },
      "performance": { deps: ["Sitecore"]},
      "sitecore": { deps: ["Sitecore"] }
    },
    map: {
      "*": {
          "css": "/sitecore/shell/client/Speak/Assets/lib/core/2.0/deps/css.js"
      }
    }
  });

  //backward compatibility
  define("sitecore", function () {
    return window.Sitecore.Speak;
  } );

  define( "HandlebarsLib", function ( handlebars ) {
      window.Handlebars = handlebars;
      return handlebars;
  } );

  require( ["Sitecore", "scSpeakPresenter", "performance"], function ( Sitecore, back, performanceUtil ) {
      if (Sitecore.isDebug()) {
          performanceUtil.enablePerformanceTracking();
      }
    Sitecore.init();
  });
})(this);
