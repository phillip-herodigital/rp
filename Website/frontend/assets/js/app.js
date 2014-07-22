ngApp = angular.module("ngApp", ['ui.bootstrap',
                                 'ui.slider',
                                 'unobtrusive.validation',
                                 'maskJQuery',
                                 'n3-line-chart']);

// Init Application
ngApp.value("appName", "ngApp");