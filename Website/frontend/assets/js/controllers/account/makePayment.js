/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    var ctrl = this;
    this.invoices = null;
    this.paymentMethods = null;
    this.selectedAccounts = [];
    this.total = 0;

    $scope.$watch(function () { return _.pluck(ctrl.invoices.values, 'selected'); }, function (newValue) {
        ctrl.selectedAccounts = _.where(ctrl.invoices.values, { 'selected': true, 'canMakeOneTimePayment': true });
        ctrl.total = _.reduce(ctrl.selectedAccounts, function (a, b) { return a + parseFloat(b.invoiceAmount); }, 0);
        ctrl.paymentAmount = ctrl.total;
    }, true);

    // Disable weekends selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };
    $scope.minDate = new Date();
    
    $scope.activeState = 'step1';

    $scope.continue = function() {
        $scope.activeState = (($scope.activeState == 'step1') ? 'step2' : 'step3');
    };

    $scope.back = function() {
        $scope.activeState = 'step1';
    };

}]);