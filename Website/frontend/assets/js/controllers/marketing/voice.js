ngApp.controller('voiceCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.showHubFeatures = false;
    $scope.bundleLink = "";
    $scope.$watch('digitalVoiceSettings', function(){
    	var params = '&sales_source=' + $scope.digitalVoiceSettings.referralUrl.SalesSource 
    		+ '&associate_a_number=' + $scope.digitalVoiceSettings.referralUrl.AgentId
    		+ ($scope.digitalVoiceSettings.referralUrl.FreeEnergyReferralId != "" ? ('&free_sponsorship_id=' + $scope.digitalVoiceSettings.referralUrl.FreeEnergyReferralId) : '');
        $scope.hubLink = $scope.digitalVoiceSettings.hubUrl + params;
    	$scope.airLink = $scope.digitalVoiceSettings.airUrl + params;
    	$scope.bridgeLink =  $scope.digitalVoiceSettings.bridgeUrl + params;
    });
}]);
