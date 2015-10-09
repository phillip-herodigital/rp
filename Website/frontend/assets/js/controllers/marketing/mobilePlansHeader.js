/* Mobile Plans Header Controller
 *
 */
ngApp.controller('MobilePlansHeaderCtrl', ['$scope', 'enrollmentService' , function ($scope, enrollmentService) {
   
    $scope.setServerData = function (serverData) {
        enrollmentService.setClientData(serverData);
        $scope.accountInformation = enrollmentService.accountInformation;
        $scope.associateInformation = enrollmentService.associateInformation;
    };


}]);