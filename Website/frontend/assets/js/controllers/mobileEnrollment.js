ngApp.controller('MobileEnrollmentCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    // Use the service to track everything we want to submit with the order
    $scope.mobileEnrollmentService = mobileEnrollmentService;

    // Use this to keep track of some stuff we want throughout the process, but don't need with the order
    $scope.mobileEnrollment = {
        currentStep: "choose-network",
        phoneTypeTab: "new"
    };

    $scope.setCurrentStep = function(step) {
        $scope.mobileEnrollment.currentStep = step;
        console.log($scope.mobileEnrollmentService);
    };

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