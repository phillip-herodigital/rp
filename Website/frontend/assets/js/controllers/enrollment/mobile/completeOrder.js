ngApp.controller('MobileEnrollmentCompleteOrderCtrl', ['$scope', '$filter', '$timeout', '$modal', '$http', 'jQuery', 'mobileEnrollmentService', function ($scope, $filter, $timeout, $modal, $http, $, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();
    $scope.isBreakdownShown = false;
    $scope.llcClassifcation = '';
    $scope.currentDate = new Date();

    // start over on refresh
    $scope.$watch('cart.items', function(newValue, oldValue) {
        if (newValue.length == 0) {
            $scope.resetEnrollment();
        }
    });

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
            $scope.businessInformation.signatureImage = (modalData.selectedTab == 'draw') ? $sigdiv.jSignature("getData", "image")[1] : modalData.image;
            $scope.businessInformation.signature = modalData.name;
        });
    };

    $scope.completeStep = function() {
        mobileEnrollmentService.isLoading = true;
        // format the post data
        var item = $scope.cart.items[0];
        var additionalClassification = null;
        if ($scope.businessInformation.taxClassification == 'LLC') {
            additionalClassification = $scope.llcClassification;
        }
        if ($scope.businessInformation.taxClassification == 'Other') {
            additionalClassification = $scope.otherClassification;
        }
        mobileEnrollmentService.accountInformation = $scope.accountInformation;
        mobileEnrollmentService.businessInformation = $scope.businessInformation;
        var userContext = {
            deviceMake: item.make.make,
            deviceModel: item.model.modelName,
            deviceSerial: item.imeiNumber,
            simNumber: item.simNumber,
            newNumber: (item.number.type == 'new') ? item.number.value : null,
            portInNumber: (item.number.type == 'existing') ? item.number.value : null,
            previousServiceProvider: mobileEnrollmentService.previousServiceProvider != null ? mobileEnrollmentService.previousServiceProvider.name : null,
            planId: $scope.cart.dataPlan.planId,
            contactInfo: $scope.accountInformation.contactInfo,
            billingAddress: $scope.accountInformation.billingAddress,
            shippingAddress: ($scope.accountInformation.shippingAddressSame) ? $scope.accountInformation.billingAddress : $scope.accountInformation.shippingAddress,
            shippingAddressSame: $scope.accountInformation.shippingAddressSame,
            businessAddress: ($scope.businessInformation.businessAddressSame) ? $scope.accountInformation.billingAddress : $scope.businessInformation.businessAddress,
            businessAddressSame: $scope.businessInformation.businessAddressSame,
            businessInformationName: $scope.accountInformation.businessInformationName,
            businessName: $scope.accountInformation.businessName,
            businessTaxClassification: $scope.businessInformation.taxClassification,
            additionalTaxClassification: additionalClassification,
            exemptCode: $scope.businessInformation.exemptCode,
            fatcaCode: $scope.businessInformation.fatcaCode,        
            currentAccountNumbers: $scope.businessInformation.currentAccountNumbers,
            socialSecurityNumber: ($scope.tin == 'ssn') ? $scope.businessInformation.socialSecurityNumber : null,
            taxId: ($scope.tin == 'taxId') ? $scope.businessInformation.taxId : null,
            customerCertification: $scope.businessInformation.customerCertification,
            customerSignature: $scope.businessInformation.signature,
            signatureImage: $scope.businessInformation.signatureImage,
            signatureConfirmation: $scope.businessInformation.signatory,
            signatoryName: $scope.businessInformation.signatoryName,
            signatoryRelation: $scope.businessInformation.signatoryRelation,
            agreeToTerms: $scope.businessInformation.agreeToTerms,
            tcpaPreference: $scope.businessInformation.tcpaPreference,
            associateId: $scope.associateId,
            restoreData: angular.toJson(mobileEnrollmentService.getRestoreData())
        }

        // send the post
        $http.post('/api/mobileEnrollment/submit', userContext)
        .success(function (data) {
            mobileEnrollmentService.isLoading = false;
            mobileEnrollmentService.confirmationId = data.id;
            $scope.setCurrentStep('order-confirmation');
        })
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
        var image;
        if ($scope.selectedTab != 'draw') {
            var canvas = document.createElement('canvas');
            canvas.width = 496;
            canvas.height = 90;
            var context = canvas.getContext('2d');
            
            context.font = '70px "ff-market-web", cursive';
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.fillText($scope.formData.name, 0, 0)

            image = canvas.toDataURL();
            image = image.substr('data:image/png;base64,'.length);
        }

        var modalData = {
            name: $scope.formData.name,
            selectedTab: $scope.selectedTab,
            image: image
        }
        $modalInstance.close(modalData);
    };

}]);