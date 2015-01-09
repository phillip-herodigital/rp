ngApp.controller('MobileUsageCalculatorCtrl', ['$scope', '$http', function ($scope, $http) {
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

    $scope.connected = false;

    $scope.connect = {
        username: "5164496292",
        password: "37Beetlestone",
        acceptTermsCheckbox: false
    };

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

	$scope.selectCarrierConnect = function(carrier) {
		$scope.connect.carrier = carrier;
	};

    $scope.callValidas = function() {
        if(! $scope.connect.acceptTermsCheckbox) {
            alert("Must accept terms");
            return;
        }   
        if(! $scope.connect.username || ! $scope.connect.password || ! $scope.connect.carrier) {
            alert("Required fields");
            return;
        }

        $http({
            method  : 'POST',
            url     : '/en/services/mobile/validas-endpoint',
            data    : {  
                        username: $scope.connect.username, 
                        password: $scope.connect.password,
                        carrier:  $scope.connect.carrier 
                      },
            headers : { 'Content-Type': 'application/JSON' } 
        })  

        .success(function (data, status, headers, config) {
            $scope.connect.validas = data;
            $scope.connected = true;
        });
    };

    $scope.getSprintRecommendation = function() {
        return $scope.getRecommendationForCarrier('sprint');
    };

    $scope.getAttRecommendation = function() {
        return $scope.getRecommendationForCarrier('att');
    };

    $scope.getRecommendationForCarrier = function(carrier) {
        if(typeof($scope.connect.validas) === 'undefined') { return false; }

        var r = $.grep($scope.connect.validas.recommendations, function(n, i) {
            return n.Carrier.toLowerCase() === carrier.toLowerCase();
        });
        if(r && r.length > 0) { return r[0]; }
        return null;
    };


    $scope.attPlans = function() {
        return $scope.plansForCarrier('att');
    };

    $scope.sprintPlans = function() {
        return $scope.plansForCarrier('sprint');
    };

    $scope.plansForCarrier = function(carrier) {
        return $.grep(DataPlans.plans, function(n){return n.carrier.toLowerCase() === carrier.toLowerCase();})[0].plans;
    };

    $scope.getAttPlanById = function(id) {
        return $.grep($scope.attPlans(), function(n){return n.planId === id;})[0];
    }

    $scope.getSprintPlanById = function(id) {
        return $.grep($scope.sprintPlans(), function(n){return n.planId === id;})[0];
    }
 
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

    $scope.selectCarrierConnect('att');


/* 
    $scope.connect.validas = {
        averageMonthlyCost: 65,
        averageMonthlyData: 593,
        billingCount: 1,
        leasedPayoffFee: 0,
        network: "att",
        phoneLines: 1,
        recommendations: [
            {
                AdditionalLineCharge: 15,
                Carrier: "Att",
                Cost: 47,
                DataIncluded: 1000,
                Id: "65",
                MaxLines: 1,
                PerMbOverage: 0.15,
                RecommendationCost: 47
            },
            {
                AdditionalLineCharge: 0,
                Carrier: "Sprint",
                Cost: 30,
                DataIncluded: 1000,
                Id: "27",
                MaxLines: 1,
                PerMbOverage: 0.15,
                RecommendationCost: 30
            }
        ]
    };
    $scope.connected = true;
   */


}]);