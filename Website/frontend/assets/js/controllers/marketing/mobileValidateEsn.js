/* Mobile Plans Details Controller
 *
 */
ngApp.controller('MobileValidateEsnCtrl', ['$scope', '$http', '$sce', '$modal', 'reCAPTCHA', function ($scope, $http, $sce, $modal, reCAPTCHA) {

    $scope.form = {
        esn: null
    };
    $scope.esnValidationMessages = [];
    $scope.showCaptcha = false;

    $scope.validateESN = function () {
        $scope.isLoading = true;
        $scope.esnError = $scope.esnValid = false;
        var convertedImei = null;
        $scope.supportsLte = true;
        // do the hex conversion for CDMA MEID/ESN-DEC
        if ($scope.form.esn.length == 14) {
            convertedImei = convertToMEIDDec($scope.form.esn);
        }
        var formData = {
                imei: convertedImei == null ? $scope.form.esn : convertedImei,
                captcha: $scope.form.captcha,
            };
        $http.post('/api/enrollment/verifyImei', formData, { transformRequest: function (code) { return JSON.stringify(code); } })
            .success(function (data) {
                if (!data.isValidImei) {
                    $scope.esnError = true;
                    if(data.verifyEsnResponseCode) {
                        $scope.esnMessage = _.find($scope.esnValidationMessages, function (message) { 
                                return message.code.toLowerCase() == data.verifyEsnResponseCode.toLowerCase();
                            }).message;
                    }
                } else {
                    $scope.esnValid = true;
                    $scope.networkType = data.provider == 'att' ? 'GSM' : 'CDMA';
                    $scope.phoneManufacturer = data.manufacturer;
                    $scope.supportsLte = (data.deviceType === 'U' || (data.deviceType === 'E' && data.iccid && data.iccid.length > 0));
                    if (!$scope.supportsLte && $scope.networkType == 'CDMA') {
                        $scope.esnMessage = '';
                    }
                }
                if ($scope.showCaptcha) {
                    reCAPTCHA.reload($scope.widgetId);
                }
                $scope.isLoading = false;
                isAttemptsExceeded();
            });
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

    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };

}]);