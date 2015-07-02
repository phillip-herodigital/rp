/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsCalendarCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.weeks = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    $scope.weekAbbrs = [ 'Sn', 'M', 'T', 'W', 'Th', 'F', 'St' ];
    $scope.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    $scope.events = {
        '07-01-2015' : '<a href="#">Test Event</a>',
        '07-02-2015' : [ 
        {content: '<a href="#">Test Event 2 is really long</a>'},
        {content: '<a href="#" class="events">Test Event 3</a>'},
        {content: '<a href="#" class="promotions">Test Event 4</a>'},
        {content: '<a href="#" class="recognition">Test Event 5</a>'}],
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

    $scope.searchCalendar = function () {
        $scope.events = {
            '07-02-2015' : '<a href="#">Test Event2</a>',
        };
        $scope.cal.setData($scope.events, true);
    };

}]);