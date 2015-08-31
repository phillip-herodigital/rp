/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsSearchCalendarCtrl', ['$scope', '$rootScope', '$http', '$compile', function ($scope, $rootScope, $http, $compile) {
    $scope.weeks = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    $scope.weekAbbrs = [ 'Sn', 'M', 'T', 'W', 'Th', 'F', 'St' ];
    $scope.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];


    $scope.searchCalendar = function () {
        var filteredEvents = angular.copy($scope.eventsOriginal);
        alert(filteredEvents.toSource())
        _.forEach(filteredEvents, function(eventsArray, day) {
            if ($scope.typeFilter != null) {
                filteredEvents[day] = _.filter(eventsArray, {category: $scope.typeFilter});
            }
            if ($scope.stateFilter != null) {
                filteredEvents[day] = _.filter(eventsArray, function(singleEvent) {
                    return singleEvent.state.indexOf($scope.stateFilter) > -1
                })
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

    $scope.searchCalendarKeyword = function () {
        var $keyword = $scope.searchTerm;
        if ($keyword != null) {

            $http.get('/api/currents/CalendarSearch/' + $keyword).success(function (data, status, headers, config) {
                $scope.events = data;
                $scope.eventStates = _($scope.events).filter().flatten().pluck('state').filter().flatten().uniq().value()
            });
        }
    }

}]);