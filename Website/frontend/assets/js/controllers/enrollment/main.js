﻿/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$rootScope', '$http', 'enrollmentService', function ($scope, $rootScope, $http, enrollmentService) {

    $scope.serverData = {}; // This array should keep track of all the form fields we collect for the enrollment
    $scope.currentSection = 'serviceInformation';
    $scope.nextSection = true;
    $scope.extraFields = {};

    $scope.sections = [
        {
            id: 'serviceInformation',
            name: 'Let\'s Get Started',
            order: 1,
            isVisible: true
        },
        {
            id: 'planSelection',
            name: 'Choose Your Plan',
            order: 2,
            isVisible: false
        },
        {
            id: 'accountInformation',
            name: 'Setup Your Account',
            order: 3,
            isVisible: false
        }
        ,
        {
            id: 'verifyIdentity',
            name: 'Verify Identity',
            order: 4,
            isVisible: false
        }
        ,
        {
            id: 'completeOrder',
            name: 'Confirm Order',
            order: 5,
            isVisible: false
        }
    ];

    $scope.setServerData = function () {
        //TODO: Replace AJAX with static variable once available
        console.log('Setting initial server data:');

        var clientDataPromise = enrollmentService.getClientData();

        clientDataPromise.then(function (data) {
            $scope.serverData = data;
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);