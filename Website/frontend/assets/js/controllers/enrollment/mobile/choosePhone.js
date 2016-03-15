ngApp.controller('MobileEnrollmentChoosePhoneCtrl', ['$scope', '$filter', '$modal', '$http', '$sce', 'enrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'scrollService', 'analytics', 'reCAPTCHA', function ($scope, $filter, $modal, $http, $sce, enrollmentService, enrollmentStepsService, enrollmentCartService, scrollService, analytics, reCAPTCHA) {

    var maxMobileItems = 10;

    $scope.getCartDevices = enrollmentCartService.getCartDevices;
    $scope.getDevicesCount = enrollmentCartService.getDevicesCount;
    $scope.getCartDataPlan = enrollmentCartService.getCartDataPlan;
    $scope.activationCodeInvalid = true;
    $scope.esnInvalid = false;
    $scope.esnError = false;
    $scope.missingActivationCode = false;
    $scope.missingIccid = false;
    $scope.showIccid = true;
    $scope.showCaptcha = false;
    $scope.phoneOptions = {
        color: undefined,
        size: undefined,
        imeiNumber : undefined,
        transferInfo: undefined,
        supportsLte: undefined 
    };
    $scope.mobileEnrollment.phoneTypeTab = 'existing';

    $scope.verifyPhone = function () {
        $scope.hasError = false;
        $scope.deviceIneligible = false;
        $scope.gsmIneligible = false;
        $scope.cdmaIneligible = false;
        $scope.duplicateDevice = false;
        $scope.phoneVerified = false;
        $scope.cdmaActive = false;
        $scope.phoneOptions.supportsLte = true;
        var cartDevices = $scope.getCartDevices();
        if (_(cartDevices).pluck('imeiNumber').filter().flatten().contains($scope.phoneOptions.imeiNumber)) {
            $scope.hasError = true;
            $scope.duplicateDevice = true;
        }
        if (!$scope.hasError) {
            enrollmentService.isLoading = true;
            var convertedImei = null;
            // do the hex conversion for CDMA MEID/ESN-DEC
            if ($scope.phoneOptions.imeiNumber.length == 14) {
                convertedImei = convertToMEIDDec($scope.phoneOptions.imeiNumber);
            }
            var formData = {
                imei: convertedImei == null ? $scope.phoneOptions.imeiNumber : convertedImei,
                captcha: $scope.phoneOptions.captcha,
            };
            $http.post('/api/enrollment/verifyImei', formData, { transformRequest: function (code) { return JSON.stringify(code); } })
            .success(function (data) {
                analytics.sendVariables(2, data.provider);
                if (!data.isValidImei) {
                    $scope.hasError = true;
                    $scope.deviceIneligible = true;
                    analytics.sendVariables(17, $scope.phoneOptions.imeiNumber);
                    if(data.verifyEsnResponseCode) {
                        $scope.deviceIneligibleMessage = _.find($scope.esnValidationMessages, function (message) { 
                                return message.code.toLowerCase() == data.verifyEsnResponseCode.toLowerCase();
                            }).message;
                        if (data.verifyEsnResponseCode == 'reCaptchaError') {
                            reCAPTCHA.reload($scope.widgetId);
                        } else {
                            $scope.addDevice.imeiNumber.$setValidity('required',false);
                            $scope.validations = [{
                                'memberName': 'imeiNumber'
                            }];
                        }
                    }
                } else {
                    if (data.provider == 'att') {
                        $scope.phoneVerified = false;
                        $scope.hasError = true;
                        $scope.gsmIneligible = true;
                        $scope.deviceIneligibleMessage = '';
                        if ($scope.showCaptcha) {
                            reCAPTCHA.reload($scope.widgetId);
                        }
                    }
                    else {
                        $scope.phoneOptions.supportsLte = (data.deviceType === 'U' || (data.deviceType === 'E' && data.iccid && data.iccid.length > 0));
                        if (!$scope.phoneOptions.supportsLte) {
                            $scope.hasError = true;
                            $scope.phoneVerified = false;
                        }
                        else {
                            $scope.phoneVerified = true;
                            $scope.phoneManufacturer = data.manufacturer;
                            $scope.phoneOptions.iccidNumber = data.iccid;
                            var responseMessage = _.find($scope.esnValidationMessages, function (message) {
                                return message.code.toLowerCase() == data.verifyEsnResponseCode.toLowerCase();
                            });
                            $scope.deviceResponseMessage = (responseMessage == undefined) ? null : responseMessage.message;
                            $scope.phoneOptions.showIccid = (data.iccid == undefined || data.iccid == '') && $scope.phoneOptions.supportsLte;
                            isAttemptsExceeded();
                            $scope.completeStep();
                        }
                    }
                }
            })
            .error(function (status) {
                console.log(status);
            });
            enrollmentService.isLoading = false;
        }
    };

    // if IMEI comes in from a query string, try to verify it
    if ($scope.mobileEnrollment.requestedImei != '') {
        $scope.phoneOptions.imeiNumber = $scope.mobileEnrollment.requestedImei;
        $scope.verifyPhone();
    }

    $scope.editMobileDevice = function (service, item) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        //update the editedDevice object so the Choose Phone page can get its state
        mobileEnrollmentService.editedDevice = item;
        //remove the device from the cart items array
        enrollmentCartService.removeDeviceFromCart(item);
        $scope.phoneOptions = item;
        $scope.phoneVerified = true;
    };

    $scope.deleteMobileDevice = function (service, item) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        //remove the device from the cart items array
        if (!$scope.phoneVerified) {
            enrollmentCartService.removeDeviceFromCart(item);
        }
        enrollmentStepsService.setFlow('mobile', false).setStep('phoneFlowDevices');
        $scope.phoneVerified = false;
        $scope.phoneOptions.imeiNumber = '';
        if ($scope.showCaptcha) {
            reCAPTCHA.reload($scope.widgetId);
        }
        scrollService.scrollTo('phoneFlowDevices', 0, 0, angular.noop);
    };
    
    $scope.isCartFull = function () {
        if (enrollmentCartService.getDevicesCount() == maxMobileItems) {
            return true;
        } else {
            return false;
        }
    };

    $scope.selectedPhone = undefined;

    $scope.validateEsn = function() {
        if ($scope.phoneOptions.imeiNumber != '' && $scope.mobileEnrollmentSettings.validateSprintEsn) {
            $scope.esnInvalid = true;
            $scope.esnError = false;
            var convertedImei = null;
            // do the hex conversion for CDMA MEID/ESN-DEC
            if ($scope.phoneOptions.imeiNumber.length == 14) {
                convertedImei = convertToMEIDDec($scope.phoneOptions.imeiNumber);
            }

            $http.post('/api/enrollment/validateEsn', convertedImei == null ? $scope.phoneOptions.imeiNumber : convertedImei, { transformRequest: function (code) { return JSON.stringify(code); } })
            .success(function (data) {
                //var esnResponse = JSON.parse(data);
                if (data.verifyEsnResponseCode.toLowerCase() != 'success') {
                    $scope.addDevice.imeiNumber.$setValidity('required',false);
                    $scope.validations = [{
                        'memberName': 'imeiNumber'
                    }];
                    $scope.esnError = true;
                    if(data.verifyEsnResponseCode) {
                        $scope.esnMessage = $sce.trustAsHtml(_.find($scope.esnValidationMessages, function (message) { 
                                return message.code.toLowerCase() == data.verifyEsnResponseCode.toLowerCase();
                            }).message);
                    }
                } else {
                    $scope.esnError = false;
                    $scope.esnInvalid = false;
                    $scope.phoneOptions.iccidNumber = data.iccid;
                    if (data.deviceType) {
                        $scope.phoneOptions.supportsLte = (data.deviceType === 'U' || (data.deviceType === 'E' && data.iccid && data.iccid.length > 0));
                    }
                }
            })
        } else {
            $scope.esnError = false;
            $scope.esnInvalid = false;
        }
    }

    $scope.validateActivationCode = function () {
            $scope.activationCodeInvalid = true;
            $scope.addDevice.activationCode.$setValidity('required', true);
            $scope.validations = [];
    }

    /**
     * Clear the phone selection whenever a user navigates
     * to different phone options
     */
    $scope.clearPhoneSelection = function() {
        $scope.selectedPhone = undefined;
        $scope.phoneOptions = {
            color: undefined,
            size: undefined,
            transferInfo: undefined,
        };
    };

    function baseConvert(number, frombase, tobase) {
        return parseInt(number + '', frombase | 0).toString(tobase | 0);
    };

    function leftPad(n, p, c) {
        var pad = new Array(1 + p).join(c);
        return (pad + n).slice(-pad.length);
    };

    function convertToMEIDHex (input) {
        return (leftPad(baseConvert(input.substr(0,10),10,16),8,0) + 
            leftPad(baseConvert(input.substr(10),10,16),6,0)).toUpperCase();
    };

    function convertToMEIDDec (input) {
        return (leftPad(baseConvert(input.substr(0,8),16,10),10,0) + 
            leftPad(baseConvert(input.substr(8),16,10),8,0)).toUpperCase();
    };

    function isAttemptsExceeded () {
        $http.get('/api/enrollment/ShowCaptcha')
        .success(function (data, status, headers, config) {
            $scope.showCaptcha = data == 'true' ? true : false;
        }).error(function () { 
            $scope.streamConnectError = true; 
        });
    };

    isAttemptsExceeded();

    /**
     * Adds the currently selected phone to the cart
     */
    $scope.addDeviceToCart = function () {
        var item = {
            showIccid: $scope.showIccid,
            phoneOS: "",
            missingIccid: false,
            transferInfo: null,
            imeiNumber: $scope.phoneOptions.imeiNumber
        };
        enrollmentCartService.addDeviceToCart(item);
        $scope.clearPhoneSelection();
        if ($scope.showCaptcha) {
            reCAPTCHA.reload($scope.widgetId);
        }
        $scope.addDevice.imeiNumber.$setValidity('required', true);
        $scope.addDevice.imeiNumber.suppressValidationMessages = true;
    };
    $scope.showUnlockingModal = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'networkUnlocking'
        })
    };

    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };

    $scope.validateIccid = function () {
        $scope.iccidInvalid = $scope.addDevice.iccid.$invalid;
    };

    $scope.continue = function () {
        enrollmentCartService.removeService(enrollmentCartService.getActiveService());
        enrollmentStepsService.setStep('phoneFlowPlans');
        enrollmentStepsService.hideStep('phoneFlowDevices');
    }

    $scope.completeStep = function () {  
        if ($scope.phoneVerified) {
            $scope.addDeviceToCart();
        }
        $scope.clearPhoneSelection();
        $scope.phoneVerified = false;
        enrollmentStepsService.setStep('phoneFlowPlans');
        $scope.addDevice.imeiNumber.suppressValidationMessages = true;
        $scope.mobileEnrollmentService.currentStepNumber = 2;
        $scope.addDevice.$setPristine();
    };
}]);