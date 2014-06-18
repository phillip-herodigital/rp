/* Select Plan Controller
 *
 * This is used to control aspects of the select plan on enrollment page.
 */
ngApp.controller('SelectPlanCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {
    $scope.slider1 = {
        'options': {
            start: function (event, ui) { $log.info('Slider start'); },
            stop: function (event, ui) { $log.info('Slider stop'); }
    $scope.slider2 = {
	'options': {
        start: function (event, ui) { $log.info('Slider start'); },
        stop: function (event, ui) { $log.info('Slider stop'); }

}]);