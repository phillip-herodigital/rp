ngApp.controller('MobileEnrollmentChoosePhoneCtrl', ['$scope', '$filter', '$modal', '$http', '$sce', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'scrollService', 'analytics', 'reCAPTCHA', function ($scope, $filter, $modal, $http, $sce, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService, scrollService, analytics, reCAPTCHA) {

    var maxMobileItems = 10;

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.getCartDevices = enrollmentCartService.getCartDevices;
    $scope.getDevicesCount = enrollmentCartService.getDevicesCount;
    $scope.getCartDataPlan = enrollmentCartService.getCartDataPlan;
    $scope.activationCodeInvalid = true;
    $scope.esnInvalid = false;
    $scope.esnError = false;
    $scope.cartLte = null;
    $scope.missingActivationCode = false;
    $scope.missingIccid = false;
    $scope.showIccid = true;
    $scope.networkType = null;
    $scope.cdmaActive = false;
    $scope.showCaptcha = false;
    $scope.phoneOptions = {
        color: undefined,
        size: undefined,
        imeiNumber : undefined,
        transferInfo: undefined,
        supportsLte: undefined 
    };
    
    $scope.mobileEnrollment.phoneTypeTab = 'existing';

    $scope.mobileEnrollmentService.currentStepNumber = 1;

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
                } else if ($scope.getDevicesCount() > 0 && mobileEnrollmentService.selectedNetwork.value != data.provider) {
                    $scope.hasError = true;
                    if ($scope.networkType == 'GSM') {
                        $scope.cdmaIneligible = true;
                    } else if ($scope.networkType == 'CDMA') {
                        $scope.gsmIneligible = true;
                    }
                } else {
                    if (data.deviceType) {
                        $scope.phoneOptions.supportsLte = (data.deviceType === 'U' || (data.deviceType === 'E' && data.iccid && data.iccid.length > 0));
                    }
                    $scope.networkType = data.provider == 'att' ? 'GSM' : 'CDMA';
                    if (!$scope.phoneOptions.supportsLte && $scope.networkType == 'CDMA') {
                        $scope.phoneVerified = false;
                        $scope.hasError = true;
                        reCAPTCHA.reload($scope.widgetId);
                    } else {
                        $scope.phoneVerified = true;
                    }
                    $scope.phoneManufacturer = data.manufacturer;
                    $scope.phoneOptions.iccidNumber = data.iccid;
                    var responseMessage = _.find($scope.esnValidationMessages, function (message) { 
                            return message.code.toLowerCase() == data.verifyEsnResponseCode.toLowerCase();
                        });
                    $scope.deviceResponseMessage = (responseMessage == undefined) ? null : responseMessage.message;
                    $scope.phoneOptions.showIccid = (data.iccid == undefined || data.iccid == '') && $scope.phoneOptions.supportsLte;
                    $scope.cdmaActive = (data.iccid != undefined & data.iccid != '');
                    analytics.sendVariables(16, $scope.phoneOptions.imeiNumber);

                    mobileEnrollmentService.selectedNetwork.value = data.provider;
                    $scope.chooseNetwork(mobileEnrollmentService.selectedNetwork.value, 'existing');
                }
                isAttemptsExceeded();
                enrollmentService.isLoading = false;
            });
        }
    };

    // if IMEI comes in from a query string, try to verify it
    if ($scope.mobileEnrollment.requestedImei != '') {
        $scope.phoneOptions.imeiNumber = $scope.mobileEnrollment.requestedImei;
        $scope.verifyPhone();
    }

    $scope.chooseNetwork = function (network, phoneType) {
        analytics.sendVariables(2, network);
        $scope.mobileEnrollment.phoneTypeTab = phoneType;
        mobileEnrollmentService.selectedNetwork = _.where($scope.mobileEnrollmentService.availableNetworks, { value: network })[0];

        //enrollmentStepsService.setStep('phoneFlowDevices');
    };

    $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
    };

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

    $scope.editDeviceNumber = function (service, item) {
        //update active service address, send to the correct page
        if(enrollmentCartService.getCartVisibility()) {
            enrollmentCartService.toggleCart();
        }
        //update the editedDevice object so the Choose Phone page can get its state
        mobileEnrollmentService.editedDevice = item;
        enrollmentStepsService.setFlow('phone', false).setStep('phoneFlowDevices');
        $scope.phoneVerified = false;
        if ($scope.showCaptcha) {
            reCAPTCHA.reload($scope.widgetId);
        }
        scrollService.scrollTo('phoneFlowDevices', 0, 0, angular.noop);
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

    $scope.isLastItem = function () {
        if (enrollmentCartService.getDevicesCount() >= maxMobileItems - 1) {
            return true;
        } else {
            return false;
        }
    };

    $scope.phoneFilters = {
        condition: undefined,
        brand: [],
        os: [],
        lte: undefined,
        phoneOrder: 'high'
    };

    $scope.selectedPhone = undefined;

    $scope.phoneNumberType = ''; // set phone number type to new number or transfer existing number
    $scope.displayFilters = false; // Display the extra phone filters

    $scope.filterCdmaBrands = function(brand){
        if (enrollmentCartService.getDevicesCount() > 0) {
            var firstDevice = enrollmentCartService.getCartDevices()[0];
            if (firstDevice.lte) {
                return _.filter(brand.models, { lte: true}).length > 0;
            } else {
                return _.filter(brand.models, { lte: false}).length > 0;
            }
        } else {
            return true;
        }
    };

    $scope.filterCdmaModels = function(model){
        if (enrollmentCartService.getDevicesCount() > 0) {
            var firstDevice = enrollmentCartService.getCartDevices()[0];
            if (firstDevice.lte) {
                return model.lte;
            } else {
                return !model.lte;
            }
        } else {
            return true;
        }
    };

    $scope.selectFirstModel = function () {
        var firstDevice = enrollmentCartService.getCartDevices()[0];
        if (typeof firstDevice != 'undefined') {
            var filteredModels = (firstDevice.lte) ? _.filter($scope.phoneOptions.make.models, { lte: true}) : _.filter($scope.phoneOptions.make.models, { lte: false}); 
        } else {
            var filteredModels = $scope.phoneOptions.make.models;
        }
        $scope.phoneOptions.model = filteredModels[0];
    }

    $scope.$watch("phoneOptions.model.lte", function (newVal, oldVal) {
        var firstDevice = enrollmentCartService.getCartDevices()[0];
        mobileEnrollmentService.hasLTEDevice = (newVal || (firstDevice != null && firstDevice.lte));
    });

    $scope.$watch(enrollmentCartService.getDevicesCount, function (newVal, oldVal) {
        if (newVal != oldVal) {
            // only allow same-kind devices to be added for Sprint
            if (newVal > 0 && mobileEnrollmentService.selectedNetwork.value == "sprint") {
                $scope.phoneFilters.lte = enrollmentCartService.getCartDevices()[0].lte;
                $scope.cartLte = $scope.phoneFilters.lte;
            } else {
                $scope.phoneFilters.lte = undefined;
                $scope.cartLte = null;
            }
        }
    });


    $scope.setPhoneNumberType = function(type) {
        $scope.phoneNumberType = type;
    };

    $scope.switchCarriers = function() {
        $scope.setCurrentStep('choose-network');
    }

    $scope.validateEsn = function() {
        if (mobileEnrollmentService.selectedNetwork.value == 'sprint' && $scope.phoneOptions.imeiNumber != '' && $scope.mobileEnrollmentSettings.validateSprintEsn) {
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
        if (mobileEnrollmentService.selectedNetwork.value == 'att' && $scope.phoneOptions.activationCode) {
            $scope.activationCodeInvalid = true;

            $http.post('/api/enrollment/validateActivationCode', $scope.phoneOptions.activationCode, { transformRequest: function (code) { return JSON.stringify(code); } })
            .success(function (data) {
                var activationCodeResponse = JSON.parse(data);
                if (!activationCodeResponse) {
                    $scope.addDevice.activationCode.$setValidity('required', false);
                    $scope.validations = [{
                        'memberName': 'activationCode'
                    }];
                } else {
                    $scope.activationCodeInvalid = false;
                    $scope.addDevice.activationCode.$setValidity('required', true);
                    $scope.validations = [];
                    $scope.phoneOptions.simNumber = activationCodeResponse;
                }
            })
        } else {
            $scope.activationCodeInvalid = true;
            $scope.addDevice.activationCode.$setValidity('required', true);
            $scope.validations = [];
        }
    }

    /** 
     * Set the default options when a new phone is selected
     */
    $scope.setSelectedPhone = function(id) {
        var item = _.where(mobileEnrollmentService.getPhones(), { id: id })[0];

        $scope.selectedPhone = item;
        $scope.phoneOptions.color = mobileEnrollmentService.getPhoneColors(id)[0].color;
        $scope.phoneOptions.size = mobileEnrollmentService.getPhoneSizes(id)[0].size;
        scrollService.scrollTo('chooseDevice', 0, 0, angular.noop);
    };

    $scope.getPhoneCount = function(id) {
        var selectedPhones = enrollmentCartService.getCartDevices();
        if (id == 'byod') {
            return _(selectedPhones).filter({ buyingOption: 'BYOD'}).size();
        } else {
            return _(selectedPhones).filter(function (phone){
                if (typeof phone.device != 'undefined' && phone.device.id == id) {
                    return phone;
                }
            }).size();
        }
    };

    $scope.phoneOptionsValid = function() {
        //check $scope.phoneOptions
        return (_.isNotEmpty($scope.phoneOptions) && $scope.phoneOptions.purchaseOption);
    };

    /**
     * Clear the phone selection whenever a user navigates
     * to different phone options
     */
    $scope.clearPhoneSelection = function() {
        $scope.selectedPhone = undefined;
        $scope.phoneOptions = {
            color: undefined,
            size: undefined,
            //condition: undefined,
            //warranty: undefined,
            transferInfo: undefined,
        };
    };

    function baseConvert(number, frombase, tobase) {
        return parseInt(number + '', frombase | 0).toString(tobase | 0);
    };

    function leftPad (n, p, c) {
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
    $scope.addDeviceToCart = function(phoneType) {

        var item = {},
        device,
        selectedModel;

        analytics.sendVariables(5, ($scope.phoneOptions.transferInfo.type == "new") ? "New Number" : "Transfer")
        analytics.sendVariables(18, $scope.phoneOptions.phoneOS);
        analytics.sendVariables(19, $scope.phoneOptions.iccidNumber);

        if ($scope.mobileEnrollment.phoneTypeTab == "new") { 
            device = $scope.selectedPhone;
            selectedModel = _.where(device.models, { size: $scope.phoneOptions.size, color: $scope.phoneOptions.color, network: $scope.mobileEnrollmentService.selectedNetwork.value })[0];
            item = {
                type: $scope.mobileEnrollment.phoneTypeTab,
                device: device,
                id: selectedModel.sku,
                price: ($scope.phoneOptions.purchaseOption == "New" || $scope.phoneOptions.purchaseOption == "Reconditioned") ? selectedModel.price : mobileEnrollmentService.getInstallmentPrice(device.id),
                salesTax: parseFloat(parseFloat(($scope.phoneOptions.purchaseOption == "New" || $scope.phoneOptions.purchaseOption == "Reconditioned") ? selectedModel.price : selectedModel.lease24, 10) * .07).toFixed(2),
                installmentMonths: ($scope.phoneOptions.purchaseOption == "New" || $scope.phoneOptions.purchaseOption == "Reconditioned") ? null : mobileEnrollmentService.getInstallmentMonths(device.id, $scope.phoneOptions.purchaseOption),
                buyingOption: $scope.phoneOptions.purchaseOption,
                activationFee: $scope.activationFee,
                make: { make: device.brand },
                model: { modelName: device.name },
                size: $scope.phoneOptions.size,
                color: $scope.phoneOptions.color,
                imageFront: device.imageFront,
                warranty: $scope.phoneOptions.warranty,
                transferInfo: ($scope.phoneOptions.transferInfo.type == "new") ? null : $scope.phoneOptions.transferInfo,
                sku: selectedModel.sku,
                lte: selectedModel.lte
            };
        }
        else {
            // do the hex conversion for CDMA MEID/ESN-DEC
            if (mobileEnrollmentService.selectedNetwork.value == "sprint" && $scope.phoneOptions.imeiNumber.length == 14) {
                $scope.phoneOptions.imeiNumber = convertToMEIDDec($scope.phoneOptions.imeiNumber);
            } else if (mobileEnrollmentService.selectedNetwork.value == "sprint" && $scope.phoneOptions.imeiNumber.length == 15) {
                $scope.phoneOptions.imeiNumber = convertToMEIDDec($scope.phoneOptions.imeiNumber.substr(0, 14));
            }

            item = {
                id: 7,
                buyingOption: 'BYOD',
                type: $scope.mobileEnrollment.phoneTypeTab,
                make: $scope.phoneOptions.make,
                model: $scope.phoneOptions.model,
                activationFee: $scope.activationFee,
                imeiNumber: $scope.phoneOptions.imeiNumber,
                simNumber: $scope.phoneOptions.simNumber,
                iccidNumber: $scope.iccidInvalid ? undefined : $scope.phoneOptions.iccidNumber,
                activationCode: $scope.phoneOptions.activationCode,
                activeDevice: $scope.cdmaActive,
                phoneOs: $scope.phoneOptions.phoneOs,
                transferInfo: ($scope.phoneOptions.transferInfo.type == 'new') ? null : $scope.phoneOptions.transferInfo,
                lte: $scope.phoneOptions.supportsLte
            };
        }

        enrollmentCartService.addDeviceToCart(item);
        $scope.addDevice.imeiNumber.$setValidity('required', true);
        $scope.addDevice.imeiNumber.suppressValidationMessages = true;
        if (phoneType) {
            $scope.mobileEnrollment.phoneTypeTab = phoneType; 
            $scope.clearPhoneSelection();
            if ($scope.showCaptcha) {
                reCAPTCHA.reload($scope.widgetId);
            }
            enrollmentStepsService.scrollToStep('phoneFlowDevices');
        }
    };

    /**
     *  Controls the checkboxes for the phone brands filter
     */
    $scope.toggleBrands = function(brand) {
        var idx = $scope.phoneFilters.brand.indexOf(brand);

        if (idx > -1) {
            $scope.phoneFilters.brand.splice(idx, 1);
        } else {
            $scope.phoneFilters.brand.push(brand);
        }
    };

    /**
     * Controls the checkboxes for the phone OS filter
     */
    $scope.toggleOSs = function(os) {
        var idx = $scope.phoneFilters.os.indexOf(os);

        if (idx > -1) {
            $scope.phoneFilters.os.splice(idx, 1);
        } else {
            $scope.phoneFilters.os.push(os);
        }
    };

    /**
     * Change the ordering of the phones
     */
    $scope.setPhoneOrder = function() {

    };

    $scope.isPhoneOrderReversed = function() {
        return $scope.phoneFilters.phoneOrder == 'high';
    };

    $scope.showUnlockingModal = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'networkUnlocking/' + mobileEnrollmentService.selectedNetwork.value
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

    /**
     * Complete the Choose Network Step
     * @return {[type]} [description]
     */
    $scope.completeStep = function () {  
        if ($scope.getDevicesCount() > 0 || $scope.phoneVerified) {
            if ($scope.phoneVerified) {
                $scope.addDeviceToCart();
            }
            
            var activeService = enrollmentCartService.getActiveService();
            var dataPlan = _(activeService.offerInformationByType).where({ key: 'Mobile' }).first();
            
            // reset the dataplan if one is selected
            if (typeof dataPlan != 'undefined' && dataPlan.value.offerSelections.length > 0 && !$scope.duplicateDevice){
                enrollmentCartService.removeMobileOffers(activeService);
            }
            $scope.clearPhoneSelection();
            $scope.phoneVerified = false;
            enrollmentStepsService.setStep('phoneFlowPlans');

            $scope.mobileEnrollmentService.currentStepNumber = 2;
        } else if ($scope.phoneOptions.imeiNumber != '') {
            $scope.verifyPhone()
        }
    };

    $scope.phoneNumberDisabled = function() {
        if ($scope.networkType == 'GSM') {
            return ($scope.phoneManufacturer == 'Apple Inc' || !$scope.phoneOptions.missingActivationCode && $scope.activationCodeInvalid);
        } else if ($scope.networkType == 'CDMA') {
            return $scope.phoneOptions.showIccid && 
                ($scope.phoneOptions.phoneOS == null || 
                    (($scope.addDevice.iccid.$invalid || $scope.phoneOptions.missingIccid) && $scope.phoneOptions.phoneOS != 'Apple') ||
                    (($scope.addDevice.iccid.$invalid && !$scope.phoneOptions.missingIccid) && $scope.phoneOptions.phoneOS == 'Apple')
                );
        } else {
            return false;
        }
    };

}]);