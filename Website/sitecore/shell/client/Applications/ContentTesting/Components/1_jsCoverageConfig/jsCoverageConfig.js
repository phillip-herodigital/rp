var contentTestingDir = "../";
var clientDir = "../../../";

var requestTimeWait = 100;
var requestTimeInterval = 100;

require.config({
  paths: {

    jquery: clientDir + "/Speak/Assets/lib/core/1.1/deps/jQuery/jquery-2.1.1",
    jqueryui: clientDir + "/Speak/Assets/lib/ui/1.1/deps/jQueryUI/jquery-ui-1.10.1.custom",
    underscore: clientDir + "/Speak/Assets/lib/core/1.1/deps/underscore/underscore.1.4.4",
    knockout: clientDir + "/Speak/Assets/lib/core/1.1/deps/ko/knockout-2.2.1",
    backbone: clientDir + "/Speak/Assets/lib/core/1.1/deps/backbone/backbone.1.0.0",
    sitecore: clientDir + "/Speak/Assets/lib/core/1.1/sitecore-1.0.2",
  },
  shim: {
    'jquery': { exports: 'jQuery' },
    'jqueryui': { deps: ['jquery'] },
    'underscore': { exports: '_' },
    'knockout': { deps: ['underscore'], exports: 'ko' },
    'backbone': { deps: ['jquery', 'underscore'], exports: 'Backbone' },
    'sitecore': { deps: ['backbone', 'knockout'], exports: 'Sitecore.Speak' },
  },
});