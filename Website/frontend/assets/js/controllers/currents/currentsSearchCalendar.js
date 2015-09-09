/* Currents Calendar Controller
 *
 */
ngApp.controller('CurrentsSearchCalendarCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

    $scope.isLoading = false;
    $scope.typeFilter = getParameterByName('type');
    $scope.stateFilter = getParameterByName('state');

    $scope.searchCalendar = function () {
        $scope.isLoading = true;
        $http.post('/api/currents/calendarSearch/', {
            categoryID: $scope.typeFilter,
            state: $scope.stateFilter,
            searchText: $scope.searchTerm
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
            filteredEvents = _.filter(filteredEvents, function(singleEvent) {
                return singleEvent.category.toLowerCase() == $scope.typeFilter
            });
        }
        if ($scope.stateFilter != null) {
            filteredEvents = _.filter(filteredEvents, function(singleEvent) {
                return singleEvent.states.indexOf($scope.stateFilter) > -1
            })
        }
        $scope.events = filteredEvents;
    };

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec($location.absUrl());
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

}]);