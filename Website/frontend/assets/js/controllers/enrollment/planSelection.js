/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', '$rootScope', '$filter', 'enrollmentService', 'scrollService', function ($scope, $rootScope, $filter, enrollmentService, scrollService) {
    $scope.selectedOffers = {};

    //Keep a watch on the selected offers and update the uiModel accordingly
    $scope.$watchCollection('selectedOffers', function(value) {
        //update
        console.log($scope.enrollment.uiModel.offerSelections[$scope.enrollment.currentLocation]);
    });

    $scope.createOffersPostObject = function(selectedOffers) {
        //get all offers from uiModel & from current selectedOffers, send those
        console.log(selectedOffers);
        //Create our empty locations object
        var data = { 'offerIds':{} };

       // angular.forEach(selectedOffers, function (item, id) {
       //     data.locations[item.id] = item.location;
        //});

        return data;
    };    

    /**
    * Scroll To Service Information
    */
    $scope.scrollToServiceInformation = function () {
        scrollService.scrollTo('serviceInformation', $scope.enrollment.headerHeightOffset);
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending selected offers...');

        $scope.createOffersPostObject($scope.selectedOffers);

        var selectedOffersPromise = enrollmentService.setSelectedOffers();

        selectedOffersPromise.then(function (data) {
            $scope.enrollment.serverData = data;
            $scope.activateSections('accountInformation');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);