ngApp.controller('MobileEnrollmentCtrl', ['$scope', '$rootScope', '$filter', '$modal', '$location', 'mobileEnrollmentService', function ($scope, $rootScope, $filter, $modal, $location, mobileEnrollmentService) {

    // Use the service to track everything we want to submit with the order
    $scope.mobileEnrollmentService = mobileEnrollmentService;

    // Use this to keep track of some stuff we want throughout the process, but don't need with the order
    $scope.mobileEnrollment = {
        currentStep: "choose-network",
        phoneTypeTab: "new"
    };

    //TESTING
    $scope.mobileEnrollmentService.selectedNetwork = 'att';
    $scope.mobileEnrollment.currentStep = 'configure-data';
    //END TESTING

    $scope.setCurrentStep = function(step) {
        $scope.mobileEnrollment.currentStep = step;
        $location.hash(step);
        console.log($scope.mobileEnrollmentService);
        console.log(JSON.stringify($scope.mobileEnrollmentService));
    };

    /*
        Allow for navigation through the process using back/forward buttons
        We're not using a hash that actually matches with an element ID to
        keep the browser from automatically scrolling.
     */
    $rootScope.$on('$locationChangeSuccess', function(event) {
        if($location.hash() != '') {
            $scope.setCurrentStep($location.hash());
        } else {
            $scope.setCurrentStep("choose-network");
        }
    });

}]);

_.mixin( function() {
    return {
        isNotEmpty: function(value) {
            if (_.isObject(value)) {
                return !_.any( value, function(value, key) {
                    return value === undefined;
                });
            } 
        }
   }
}());