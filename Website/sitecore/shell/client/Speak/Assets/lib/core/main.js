(function (global) {
  require.config({
    baseUrl: "/sitecore/shell/client/Speak/Assets",
    paths: {
      jquery: "lib/core/deps/jQuery/jquery-1.10.2",
      underscore: "lib/core/deps/underscore/underscore.1.4.4",
      knockout: "lib/core/deps/ko/knockout-2.2.1",
      backbone: "lib/core/deps/backbone/backbone.1.0.0",
      sitecore: "lib/core/sitecore-1.0.2",
      sitecorify: "css/sitecorify",
      bootstrap: "lib/ui/bootstrap",    
      jqueryui: "lib/ui/deps/jQueryUI/jquery-ui-1.10.1.custom",
      dynatree: "lib/ui/deps/DynaTree/jquery.dynatree-1.2.4",
      dynatreecss: "lib/ui/deps/DynaTree/skin-vista/ui.dynatree"
    },
    shim: {
      'jquery': { exports: 'jQuery' },
      'jqueryui': { deps: ['jquery'] },
      'underscore': { exports: '_' },
      'knockout': { deps: ['underscore'], exports: 'ko' },
      'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
      'sitecore': { deps: ['backbone', 'knockout'], exports: 'Sitecore' },
      'dynatree': { deps: ['jqueryui'/*, 'css!dynatreecss'*/] }
    },
    map: {
      '*': {
        'css': 'lib/core/deps/css'
      }
    }
  });

  require(["sitecore"], function (_sc) {
    _sc.load(global);
  });
})(this);