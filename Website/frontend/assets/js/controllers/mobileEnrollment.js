﻿ngApp.controller('MobileEnrollmentCtrl', ['$scope', '$rootScope', '$filter', '$modal', '$location', 'mobileEnrollmentService', function ($scope, $rootScope, $filter, $modal, $location, mobileEnrollmentService) {

    // Use the service to track everything we want to submit with the order
    $scope.mobileEnrollmentService = mobileEnrollmentService;

    // Use this to keep track of some stuff we want throughout the process, but don't need with the order
    $scope.mobileEnrollment = {
        currentStep: "choose-network",
        phoneTypeTab: "new"
    };

    $scope.accountInformation = {
        shippingAddressSame: true,
        contactInfo: {
            phone: [{
                    number: '',
                    category: 'mobile'
                }],
        }
    };

    $scope.businessInformation = {
        businessAddressSame: true,
        signatory: true
    };

    $scope.remainingMinutes = '';

    $scope.setCurrentStep = function(step) {
        $scope.mobileEnrollment.currentStep = step;
        $location.hash(step);
        console.log($scope.mobileEnrollmentService);
        //console.log(JSON.stringify($scope.mobileEnrollmentService));
    };

    $scope.resetEnrollment = function () {
        mobileEnrollmentService.resetEnrollment();
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

    $scope.showModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl
        })
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