/* Select Plan Controller
 *
 * This is used to control aspects of the select plan on enrollment page.
 */
ngApp.controller('SelectPlanCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {
    $scope.sliderValues = {
        slider1: '',
        slider2: ''
    };

    $scope.sliders = [
        {
            'options': {
                min: 0,
                max: 3,
                step: 1,
                range: 'min',
                slide: function (event, ui) {
                    console.log(ui);
                }
            }
        },{
            'options': {
                min: 0,
                max: 3,
                step: 1,
                range: 'min',
                slide: function (event, ui) {

                }
            }
        }
    ];
}]);