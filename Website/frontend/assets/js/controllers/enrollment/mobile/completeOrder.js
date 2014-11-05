ngApp.controller('MobileEnrollmentCompleteOrderCtrl', ['$scope', '$filter', '$timeout', '$modal', 'jQuery', 'mobileEnrollmentService', function ($scope, $filter, $timeout, $modal, $, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();
    $scope.isBreakdownShown = false;
    $scope.llcClassifcation = '';
    $scope.currentDate = new Date();

    $scope.accountInformation = {
        shippingAddressSame: true,
        contactInfo: {
            phone: [{
                    number: '',
                    category: ''
                }],
        }
    };

    $scope.businessInformation = {
        businessAddressSame: true,
        signatory: true
    };

    $scope.toggleBreakdown = function() {
        $scope.isBreakdownShown = !$scope.isBreakdownShown;     
    };

    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.editPlan = function() {
        $scope.setCurrentStep('configure-data');
    };

    $scope.showSignatureModal = function (templateUrl) {
        var $sigdiv;
        var signatureModalInstance = $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'windowClass': 'signature',
            'controller': 'MobileEnrollmentCompleteOrderSignatureModalCtrl'
        });
        signatureModalInstance.opened.then(function () {
            $timeout ( function(){
                $sigdiv = $('.modal-content #draw-signature').jSignature({width:496, height: 90, 'decor-color': 'transparent'});
            },0);
        });
        signatureModalInstance.result.then(function (modalData) {
            $scope.businessInformation.signatureImage = (modalData.selectedTab == 'draw') ? $sigdiv.jSignature("getData", "image")[1] : null;
            $scope.businessInformation.signature = modalData.name;
        });
    };

    $scope.completeStep = function() {
        // format the post data

        // send the post

        // set the response variables to scope

        // go to the confirmation page
        $scope.setCurrentStep('order-confirmation');
    };

}]);

ngApp.controller('MobileEnrollmentCompleteOrderSignatureModalCtrl', ['$scope', '$modalInstance', 'mobileEnrollmentService', function ($scope, $modalInstance, mobileEnrollmentService) {

    $scope.selectedTab = 'type';
    $scope.formData = {
        name: ''
    };

    $scope.selectTab = function(name) {
        $scope.selectedTab = name;
    };

    $scope.submit = function () {
        var modalData = {
            name: $scope.formData.name,
            selectedTab: $scope.selectedTab
        }
        $modalInstance.close(modalData);
    };

}]);