/* Protective Services Enrollment Controller */
ngApp.controller('protectiveServicesEnrollmentCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', 'analytics', function ($scope, enrollmentService, enrollmentCartService, analytics) {

    $scope.services = [
        {
            name: 'Virtual MD',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do other things', 'do other other things']
        },
        {
            name: 'Roadside',
            description: 'Access a doctor',
            showDetails: false,
            selected: true,
            details: ['do thing 1', 'do other things', 'do other other things']
        },
        {
            name: 'Identity',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do other things', 'do other other things']
        },
        {
            name: 'Credit',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do other things', 'do other other things']
        },
        {
            name: 'Tech Support',
            description: 'Access a doctor',
            showDetails: false,
            selected: false,
            details: ['do thing 1', 'do other things', 'do other other things']
        }
    ];

    $scope.completeStep = function () {
    }
}]);