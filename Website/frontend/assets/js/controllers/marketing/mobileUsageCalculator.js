ngApp.controller('MobileUsageCalculatorCtrl', ['$scope', function ($scope) {
    $scope.tabs = UsageCalculator.tabs;

    $scope.sliderVals = UsageCalculator.sliderVals;

    // in KB
    $scope.dataMultipliers = {
        emails:   20,
        pictures: 300,
        music:    1024,
        video:    4096,
        surfing:  500
    }

    $scope.connectCarrier = '';

    $scope.calculatorTotal = 0;

    $scope.currentTab = 'connect.tpl.html';

    $scope.manualCalculator = {
        lines: 1,
        emails: 0,
        pictures: 0,
        music: 0,
        video: 0,
        surfing: 0
    };

    $scope.sliderOptions = {
        orientation: 'horizontal',
        min: 0,
        max: 2,
        range: 'min'
    };


    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    };
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };

    $scope.isConnectCarrierSelected = function(carrier) {
        return carrier === $scope.connectCarrier ? 'selected' : '';
    }

	$scope.selectCarrierConnect = function(carrier) {
		$scope.connectCarrier = carrier;
	};

    $scope.setLines = function(lines) {
        $scope.manualCalculator.lines = lines;
    };

    $scope.recalculate = function() {

        var subtotal = 0;
        for(var key in $scope.dataMultipliers) {
            subtotal += ( $scope.dataMultipliers[key] * $scope.sliderVals[$scope.manualCalculator[key]] )
        }

        $scope.calculatorTotal = subtotal * $scope.manualCalculator.lines;

    };

    $scope.calculatorTotalInGB = function() {
        return Math.min( ($scope.calculatorTotal / (1024 * 1024) ).toFixed(1), 10 );
    };

    $scope.calculatorTotalInPct = function() {
        return ( ( $scope.calculatorTotalInGB() / 10 ) * 100).toFixed();
    };

    $scope.calculatorRecommendationInGB = function() {
        var gb = $scope.calculatorTotalInGB();
        if(gb == 0) { return 0; }
        return Math.min( ( $scope.calculatorTotalInGB() + 4), 10 ).toFixed();
    };

    $scope.calculatorRecommendationInPct = function() {
        return ( ( $scope.calculatorRecommendationInGB() / 10 ) * 100).toFixed();
    };

    $scope.estimateLabelLeft = function() {
        return Math.max($('.estimate').width() - $('.estimatedDataLabel').width() - 5, 0);
    }

    $scope.recommendedLabelLeft = function() {
        return Math.max($('.frame .recommended').width() - $('.recommendedLabelContainer .recommended').width() - 5, 0);
    }

    $scope.$watch('manualCalculator', function(newVal, oldVal) {
        $scope.recalculate();
    }, true);


    $scope.callValidas() {
        $.ajax({
            type: "POST",
            url: "/en/services/mobile/validas-endpoint",
            data: { 
                name:     $scope.username, 
                password: $scope.password,
                carrier:  $scope.connectCarrier 
            }
        })
        .done(function( msg ) {
            // todo: stuff
        })
        .fail(function(){
            console.log("Validas verifiation failed.");
        });
    }


    $scope.selectCarrierConnect('att');

}]);