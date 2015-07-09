/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsCalendarCtrl', ['$scope', '$rootScope', '$http', '$compile', function ($scope, $rootScope, $http, $compile) {
    $scope.weeks = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    $scope.weekAbbrs = [ 'Sn', 'M', 'T', 'W', 'Th', 'F', 'St' ];
    $scope.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

    $http.get('/api/currents/calendarEvents').success(function (data, status, headers, config) { 
        $scope.events = data; 
        $scope.eventsOriginal = angular.copy($scope.events);
        $scope.eventStates = _($scope.events).filter().flatten().pluck('state').uniq().value();

        $scope.cal = $('#calendar').calendario({
            weeks : $scope.weeks,
            weekabbrs : $scope.weekAbbrs,
            months : $scope.months,
            displayWeekAbbr : true,
            displayMonthAbbr : false,
            startIn : 0,
            caldata : $scope.events,
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
    });


    $scope.searchCalendar = function () {
        var filteredEvents = angular.copy($scope.eventsOriginal);
        _.forEach(filteredEvents, function(eventsArray, day) {
            if ($scope.typeFilter != null) {
                filteredEvents[day] = _.filter(eventsArray, {category: $scope.typeFilter});
            }
            if ($scope.stateFilter != null) {
                filteredEvents[day] = _.filter(eventsArray, {state: $scope.stateFilter});
            }
            if ($scope.searchTerm != null) {
                filteredEvents[day] = _.filter(eventsArray, function(singleEvent) {
                    return singleEvent.content.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1
                })
            }
        });
        $scope.events = filteredEvents;
        $scope.cal.setData($scope.events, true);
    };

}]);