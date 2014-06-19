ngApp.controller('OfferOptions-TexasElectricity', ['$scope', function ($scope) {
    // this is probably not terribly smart... we're pulling based off of $scope variables actually defined by markup ng-repeats...
    var rules = $scope.selectedOffer.optionRules;

    // TODO - use the rules for this stuff.

    $scope.minDate = new Date();
    $scope.minDate.setHours(0, 0, 0, 0);

    var connectDate = new Date();
    connectDate.setDate(new Date().getDate() + 4);
    $scope.selectedOffer.offerOption = { connectDate: connectDate, optionType: "TexasElectricity" };
    $scope.connectionFee = '0.00';

    $scope.checkDateClass = function (date) {
        var lastPriorityDate = new Date();
        lastPriorityDate.setDate(new Date().getDate() + 3);
        return { 'red': date <= lastPriorityDate && date >= $scope.minDate };
    };

    $scope.checkDisabledDate = function (date, mode) {
        if (mode !== 'day')
            return false;

        return false;
    }
}]);
