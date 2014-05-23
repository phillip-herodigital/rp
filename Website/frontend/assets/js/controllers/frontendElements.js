﻿/* Frontend Elements Controller
 * This controller is used for the frontend elements test page
 */
ngApp.controller('FrontendElementsCtrl', ['$scope', '$modal', 'modalFactory', function ($scope, $modal, modalFactory) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function () {

        var modalInstance = modalFactory.open({
            //templateUrl: 'myModalContent.html',
            //controller: ModalInstanceCtrl,
            modalContent: {
                title: "Modal Title",
                body: "This is a basic <strong>modal</strong>.",
                button: "Close Modal"
            },
            resolve: {
                data: function () {
                    return {
                        items: $scope.items
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, data) {

    $scope.items = data.items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
};