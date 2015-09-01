/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsSearchCalendarCtrl', ['$scope', '$rootScope', '$http', '$compile', function ($scope, $rootScope, $http, $compile) {
    $scope.weeks = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
    $scope.weekAbbrs = [ 'Sn', 'M', 'T', 'W', 'Th', 'F', 'St' ];
    $scope.months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];


    $scope.searchCalendar = function () {
        var filteredEvents = angular.copy($scope.eventsOriginal);
        _.forEach(filteredEvents, function(eventsArray) {
            if ($scope.typeFilter != null) {
                filteredEvents = _.filter(eventsArray, {category: $scope.typeFilter});
            }
            if ($scope.stateFilter != null) {
            }
            if ($scope.searchTerm != null) {
            }
        });
        $scope.events = filteredEvents;
    };

    $scope.searchCalendarKeyword = function () {
        var $keyword = $scope.searchTerm;
        if ($keyword != null) {

            $http.get('/api/currents/CalendarSearch/' + $keyword).success(function (data, status, headers, config) {
                $scope.events = data;
                $scope.eventsOriginal = angular.copy($scope.events);

                var states = _($scope.events).filter().flatten().pluck('state').flatten().uniq().value();
                states = states.join(',');
                states = states.split(',');
                states = jQuery.unique(states);
                $scope.eventStates = states;
            });
        }
    }

}]);