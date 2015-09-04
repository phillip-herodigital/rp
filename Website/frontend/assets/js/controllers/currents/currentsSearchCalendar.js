/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsSearchCalendarCtrl', ['$scope', '$rootScope', '$http', '$compile', function ($scope, $rootScope, $http, $compile) {

    $scope.searchCalendar = function () {
        var filteredEvents = angular.copy($scope.eventsOriginal);
        if ($scope.typeFilter != null) {
            filteredEvents = _.filter(filteredEvents, {category: $scope.typeFilter});
        }
        if ($scope.stateFilter != null) {
            filteredEvents = _.filter(filteredEvents, function(singleEvent) {
                return singleEvent.states.indexOf($scope.stateFilter) > -1
            })
        }
        $scope.events = filteredEvents;
    };

    $scope.searchCalendarKeyword = function () {
        var $keyword = $scope.searchTerm;
        if ($keyword != null) {

            $http.get('/api/currents/CalendarSearch/' + $keyword).success(function (data, status, headers, config) {
                $scope.events = data;
                $scope.eventsOriginal = angular.copy($scope.events);
                $scope.eventStates =  _($scope.events).filter().flatten().pluck('states').flatten().uniq().value();
            });
        }
    }

}]);