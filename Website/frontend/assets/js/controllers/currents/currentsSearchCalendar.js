/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsSearchCalendarCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

    $scope.isLoading = false;

    $scope.searchCalendar = function () {
        $scope.isLoading = true;
        $http.post('/api/currents/calendarSearch/', {
            categoryID: $scope.searchCategory,
            state: $scope.searchState,
            searchText: $scope.searchTerm,
            language: $scope.language
        }).success(function (data) {
            $scope.isLoading = false;
            $scope.events = data;
            $scope.eventsOriginal = angular.copy($scope.events);
            $scope.eventStates =  _($scope.events).filter().flatten().pluck('states').flatten().uniq().value();
        });
    };

    $scope.filterEvents = function () {
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

}]);