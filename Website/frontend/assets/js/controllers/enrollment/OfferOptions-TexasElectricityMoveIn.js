ngApp.controller('OfferOptions-TexasElectricityMoveIn', ['$scope', function ($scope) {
    // this is probably not terribly smart... we're pulling based off of $scope variables actually defined by markup ng-repeats...
    var rules = $scope.selectedOffer.optionRules;

    // TODO - use the rules for this stuff.

    $scope.minDate = new Date();
    $scope.minDate.setHours(0, 0, 0, 0);

    var connectDate = fromISODate(_($scope.selectedOffer.optionRules.connectDates.availableConnectDates)
        .filter({ classification: 'standard' })
        .sortBy('date')
        .first()
        .date + 'Z');
    
    $scope.selectedOffer.offerOption = $scope.selectedOffer.offerOption || { connectDate: connectDate, optionType: "TexasElectricity" };

    $scope.connectionFee = '0.00';
    $scope.$watch('selectedOffer.offerOption.connectDate', function (newDate) {
        var target = toISODate(newDate);
        var availableDate = _.find($scope.selectedOffer.optionRules.connectDates.availableConnectDates, { date: target });
        $scope.connectionFee = availableDate.fees.connectFee;
    });

    $scope.checkDateClass = function (date) {
        var target = toISODate(date);
        var availableDate = _.find($scope.selectedOffer.optionRules.connectDates.availableConnectDates, { date: target });

        if (availableDate) {
            var lastPriorityDate = new Date();
            lastPriorityDate.setDate(new Date().getDate() + 3);
            return { 'red': availableDate.classification == 'priority' };
        }
        return false;
    };

    $scope.checkDisabledDate = function (date, mode) {
        var target = toISODate(date);
        var availableDate = _.find($scope.selectedOffer.optionRules.connectDates.availableConnectDates, { date: target });

        return !availableDate;
    }
    
    function toISODate(date) {
        var curr_date = date.getDate() + '';
        var curr_month = date.getMonth() + 1 + ''; //Months are zero based
        var curr_year = date.getFullYear();
        var target = curr_year + "-" + '0'.substr(curr_month.length - 1) + curr_month + "-" + '0'.substr(curr_date.length - 1) + curr_date + "T00:00:00";

        return target;
    }
    function fromISODate(date) {
        var utcDate = new Date(date);
        return localDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
    }
}]);
