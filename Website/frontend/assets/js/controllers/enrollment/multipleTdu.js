ngApp.controller('EnrollmentMultipleTduCtrl', ['$scope', 'enrollmentService', function ($scope, enrollmentService) {
    var vm = this;

    this.selectedTdu = null;

    vm.updatePlans = function (capabilities, filterType, match) {
        for (var i = 0; i < capabilities.length; i++)
        {
            if (capabilities[i][match] != vm.selectedTdu) {
                capabilities.splice(i, 1);
                i--;
            }
        }
        enrollmentService.setServiceInformation();
    };
}]);