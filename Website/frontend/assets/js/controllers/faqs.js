/* FAQs Controller
 *
 */
ngApp.controller('FaqsCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec($location.absUrl());
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    $scope.pane = "texas";

    var requestedState = getParameterByName('state');
    if (requestedState != "") {
        $scope.pane = requestedState;
    }    
}]);