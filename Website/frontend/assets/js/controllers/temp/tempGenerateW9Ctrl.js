/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('TempGenerateW9Ctrl', ['$scope', '$http', '$filter', 'jQuery', function ($scope, $http, $filter, $) {
    $scope.formInformation = {
        name : "Full Name",
        businessName : "Business Name",
        businessClassification: "individualsoleproprietor",
        businessTypeAdditional : "BA",
        isExempt : false,
        address : "Address Line",
        city : "City",
        state : "ST",
        zip : "12345",
        socialSecurityNumber : "123456789",
        employerIdentificationNumber : "987654321",
        signature : "asdf",
    };

    var $sigdiv = $("#signature").jSignature();
    
    $scope.resetSignature = function () {
        $sigdiv.jSignature("reset");
    }

    /**
    * Complete Step
    */
    $scope.completeStep = function () {
        $scope.formInformation.signature = $sigdiv.jSignature("getData", "image")[1];
        $http.post('/api/temp/GenerateW9', $scope.formInformation).success(function (data) {
            window.location = data.url;
        });
    };
}]);