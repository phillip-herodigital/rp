ngApp = angular.module("ngApp", ['ui.bootstrap',
                                 'ui.slider',
                                 'unobtrusive.validation',
                                 'maskJQuery',
                                 'duScroll',
                                 'n3-line-chart']);

// Init Application
ngApp.value("appName", "ngApp");
ngApp.value('duScrollGreedy', true);
ngApp.value('duScrollSpyWait', 10);