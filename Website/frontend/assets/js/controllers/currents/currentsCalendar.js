/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsCalendarCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.weeks = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    $scope.weekAbbrs = [ 'Sn', 'M', 'T', 'W', 'Th', 'F', 'St' ];
    $scope.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    $scope.events = {
        '06-30-2015' : '<a href="#">Test Event</a>',
    };

    $scope.cal = $('#calendar').calendario({
            weeks : $scope.weeks,
            weekabbrs : $scope.weekAbbrs,
            months : $scope.months,
            displayWeekAbbr : true,
            displayMonthAbbr : false,
            startIn : 0,
            caldata : $scope.events
    });

    $scope.previousMonth = function() {
        var currentMonth = $scope.cal.getMonth() - 1;
        var currentYear = $scope.cal.getYear();
        var previousMonth = currentMonth > 0 ? --currentMonth : 11;
        var previousYear = previousMonth < 11 ? currentYear : --currentYear;
        return $scope.months[previousMonth] + ' ' + previousYear;
    };

    $scope.nextMonth = function() {
        var currentMonth = $scope.cal.getMonth() - 1;
        var currentYear = $scope.cal.getYear();
        var nextMonth = currentMonth < 11 ? ++currentMonth : 0;
        var nextYear = nextMonth > 0 ? currentYear : ++currentYear;
        return $scope.months[nextMonth] + ' ' + nextYear;
    };

}]);