ngApp.controller('OfferOptions-GeorgiaGasMoveIn', ['$rootScope', '$scope', function ($rootScope, $scope) {
    // this is probably not terribly smart... we're pulling based off of $scope variables actually defined by markup ng-repeats...
    var rules = $scope.selectedOffer.optionRules;

    $scope.minDate = new Date();
    $scope.minDate.setHours(0, 0, 0, 0);

    var connectDate = fromISODate(_($scope.selectedOffer.optionRules.connectDates.availableConnectDates)
        .filter({ classification: 'standard' })
        .sortBy('date')
        .first()
        .date + 'Z');
    
    $scope.selectedOffer.offerOption.connectDate = $scope.selectedOffer.offerOption.connectDate || connectDate;

    $scope.connectionFee = '0.00';
    $scope.$watch('selectedOffer.offerOption.connectDate', function (newDate) {
        if (newDate) {
            if (typeof newDate == 'string')
                newDate = new Date(newDate);
            var target = toISODate(newDate);
            var availableDate = _.find($scope.selectedOffer.optionRules.connectDates.availableConnectDates, { date: target });
            $scope.selectedOffer.offerOption.connectionFee = availableDate.fees.connectFee;
            $scope.connectionFee = availableDate.fees.connectFee;
        }
    });

    $scope.checkDateClass = function (date) {
        var target = toISODate(date);
        var availableDate = _.find($scope.selectedOffer.optionRules.connectDates.availableConnectDates, { date: target });

        if (availableDate) {
            var lastPriorityDate = new Date();
            lastPriorityDate.setDate(new Date().getDate() + 3);
            return { 'priority': availableDate.classification == 'priority' };
        }
        return false;
    };

    $scope.checkDisabledDate = function (date, mode) {
        var target = toISODate(date);
        var availableDate = _.find($scope.selectedOffer.optionRules.connectDates.availableConnectDates, { date: target });

        return !availableDate;
    }

    $scope.hasAnyPriority = function () {
        return _($scope.selectedOffer.optionRules.connectDates.availableConnectDates).filter({ classification: "priority" }).any();
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
