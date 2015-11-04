/* Mobile Plans Details Controller
 *
 */
ngApp.controller('MobileValidateEsnCtrl', ['$scope', '$http', '$sce', '$modal', function ($scope, $http, $sce, $modal) {

    $scope.form = {
        esn: null
    };
    $scope.esnValidationMessages = [];
    $scope.showCaptcha = false;

    $scope.validateESN = function () {
        $scope.isLoading = true;
        $scope.esnError = $scope.esnValid = false;
        isAttemptsExceeded(true);
        var convertedImei = null;
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
                }
                $scope.isLoading = false;
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

    function isAttemptsExceeded (incrementCount) {
        $http.post('/api/enrollment/ShowCaptcha', incrementCount, { transformRequest: function (code) { return JSON.stringify(code); } 
        }).success(function (data, status, headers, config) {
            $scope.showCaptcha = data == 'true' ? true : false;
        }).error(function () { 
            $scope.streamConnectError = true; 
        });
    };

    isAttemptsExceeded(false);

    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };

}]);