ngApp.controller('MobileUsageCalculatorCtrl', ['$scope', '$http', function ($scope, $http) {

    // Main Functionality
    // --------------------------------------------------

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    };
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };

    /*$scope.selectCarrierConnect = function(carrier) {
        $scope.connect.carrier = carrier;
    };*/

    $scope.callValidas = function() {

        $scope.isLoading = true;
        $scope.validasErrors = null;

        $http({
            method: 'POST',
            url: '/en/services/mobile/validas-endpoint',
            data: {  
                username: $scope.connect.username, 
                password: $scope.connect.password,
                securityAnswer: $scope.connect.securityAnswer,
                carrier:  $scope.connect.carrier 
            },
            headers: {
                'Content-Type': 'application/JSON'
            } 
        })  
        .success(function (data, status, headers, config) {
            $scope.isLoading = false;
            if (data.Success == false) {
                $scope.validasErrors = data.Messages;
            } else {
                $scope.connect.validas = data;
                $scope.connected = true;
            }
        });
    };

    $scope.resetConnect = function() {
        $scope.connected = false;
    };

    $scope.getPlanByPlanId = function(planId) {
        var allPlans = _.flatten($scope.serverData.dataPlans, 'plans');
        return _.find(allPlans, { planId: planId });
    };

    $scope.getCarrier = function(carrier) {
        return _.find($scope.serverData.carriers, { key: carrier });
    };

    $scope.hasRecommendationForCarrier = function(carrier) {
        if($scope.currentTab === 'connect.tpl.html') {
            return $scope.getValidasRecommendation(carrier);
        } else {
            return $scope.getManualRecommendation(carrier);
        }
    };

    // Bill Scrape
    // --------------------------------------------------

    $scope.getValidasRecommendation = function(carrier) {
        if(typeof($scope.connect.validas) === 'undefined') { return false; }

        var validasPlan = _.find($scope.connect.validas.recommendations, function(n, i) {
            return n.Carrier.toLowerCase() === carrier.toLowerCase();
        });

        if(validasPlan) {
            return $scope.getPlanByPlanId(validasPlan.Id);
        } else {
            return null;
        }
    };

    $scope.calculateTCO = function(plan) {
        var total = 0,
        monthlyPrice = 0,
        activationFee = 0;

        if (!$scope.connect.validas) {
            return;
        }

        if (plan == 'att') {
            monthlyPrice = $scope.getValidasRecommendation('att').price;
            extraLineFee = ($scope.connect.validas.phoneLines - 1) * $scope.getCarrier('att').fees.extraLineFee;
            monthlyPrice += extraLineFee;
            activationFee = $scope.getCarrier('att').fees.activationFee;
        } else if (plan == 'sprint') {
            monthlyPrice = $scope.getValidasRecommendation('sprint').price;
            extraLineFee = ($scope.connect.validas.phoneLines - 1) * $scope.getCarrier('sprint').fees.extraLineFee;
            monthlyPrice += extraLineFee;
            activationFee = $scope.getCarrier('sprint').fees.activationFee;
        } else {
            monthlyPrice = $scope.connect.validas.averageMonthlyCost;
        }

        total = monthlyPrice * $scope.formData.selectedTimeframe;

        total += $scope.connect.validas.totalEtf;
        total += $scope.connect.validas.leasedPayoffFee;
        total += activationFee * $scope.connect.validas.phoneLines;

        return total;
    };

    $scope.getTCOHeight = function(plan) {
        var currentPlanHeight = 80,
        maxPlanHeight = 100,
        planHeight = 0;

        if (plan == 'currentPlan') {
            return currentPlanHeight + "px";
        }
        else {
            planHeight = $scope.calculateTCO(plan) / $scope.calculateTCO('currentPlan') * 100;
            if (planHeight > maxPlanHeight) {
                planHeight = maxPlanHeight;
            }
            return planHeight + "px";
        }
    };

    // Manual Calculator
    // --------------------------------------------------

    $scope.getManualRecommendation = function(carrier) {
        return findBestPlanFromCarrier(carrier);
    };

    $scope.calculatorTotalInGB = function(ceil) {
        if(typeof(ceil) !== 'undefined') {
            return Math.min( ($scope.calculatorTotal / (1024 * 1024) ).toFixed(1), ceil );
        } else {
             return ($scope.calculatorTotal / (1024 * 1024) ).toFixed(1);
        }
    };

    $scope.calculatorTotalInPct = function() {
        return ( ( $scope.calculatorTotalInGB(10) / 10 ) * 100).toFixed();
    };

    $scope.calculatorRecommendationInGB = function() {
        var gb = $scope.calculatorTotalInGB(10);
        if(gb == 0) { return 0; }
        return Math.min( ( $scope.calculatorTotalInGB(10) + 4), 10 ).toFixed();
    };

    $scope.calculatorRecommendationInPct = function() {
        return ( ( $scope.calculatorRecommendationInGB() / 10 ) * 100).toFixed();
    };      

    $scope.estimateLabelLeft = function() {
        return Math.max($('.estimate').width() - $('.estimatedDataLabel').width() - 15, 0);
    };

    $scope.totalSavingsForCarrier = function(carrier) {
        var fees = $scope.connect.validas.leasedPayoffFee + $scope.connect.validas.totalEtf +
                    ($scope.connect.validas.phoneLines * $scope.getCarrier(carrier).fees.activationFee);

        var savings = $scope.calculateTCO('currentPlan') - $scope.calculateTCO(carrier);

        return $scope.connect.validas.tradeInValue + savings - fees; 
    };

    $scope.$watch('manualCalculator', function(newVal, oldVal) {
        var subtotal = 0;
        for(var key in $scope.serverData.dataMultipliers) {
            subtotal += ( $scope.serverData.dataMultipliers[key] * $scope.sliderVals[$scope.manualCalculator[key]] )
        }
        $scope.calculatorTotal = subtotal * $scope.manualCalculator.lines;
    }, true);

    var findBestPlanFromCarrier = function(carrier) {
        var coll = null;

        if($scope.manualCalculator.lines == 1) {
            if(carrier === 'sprint') {
                coll = $scope.serverData.recommendedPlans.sprint.individual;
            } else {
                coll = $scope.serverData.recommendedPlans.att.individual;
            }
        } else if(carrier === 'sprint') {
            coll = $scope.serverData.recommendedPlans.sprint.group;
        }
        
        if(coll == null) { return coll; }

        return _.find(coll, function(plan) {
            return plan.data > $scope.calculatorTotalInGB(); // no ceiling, use the real value
        });
    };

    var cleanAndSortManualPlanCollection = function(coll) {
        _(coll).map(function(plan) {
            if(plan.data.toLowerCase() === 'unlimited') {
                plan.data = 1000000;
            } else {
                plan.data = parseInt(plan.data);
            }
            return plan;
        });

        return  _.sortBy(coll, 'data');
    };

    $scope.init = function(serverData) {

        $scope.serverData = serverData;

        $scope.isModal = UsageCalculator.isModal; 

        // Main Functionality
        // --------------------------------------------------

        $scope.isLoading = false;

        $scope.tabs = UsageCalculator.tabs;
        $scope.currentTab = UsageCalculator.currentTab;

        $scope.serverData.recommendedPlans.att.individual = cleanAndSortManualPlanCollection($scope.serverData.recommendedPlans.att.individual);
        $scope.serverData.recommendedPlans.sprint.individual = cleanAndSortManualPlanCollection($scope.serverData.recommendedPlans.sprint.individual);
        $scope.serverData.recommendedPlans.sprint.group = cleanAndSortManualPlanCollection($scope.serverData.recommendedPlans.sprint.group);

        // Manual Calculator
        // --------------------------------------------------

        $scope.sliderVals = $scope.serverData.sliderValues;

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

        $scope.showBreakdown = true;
        $scope.formData = {
            selectedTimeframe: 24
        };
        $scope.timeframe = [
            {
                'label': '1 Year',
                'months': 12
            },
            {
                'label': '2 Years',
                'months': 24
            }
        ];

        $scope.calculatorTotal = 0;

        // Bill Scrape
        // --------------------------------------------------

        $scope.connected = false;

        $scope.connect = {
            acceptTermsCheckbox: false
        };
        
        
        /*$scope.connect.username = "5164496292";
        $scope.connect.password = "37Beetlestone";
        */
        /*
        $scope.connect.validas = {
            "billingCount": 1,
            "network": "att",
            "phoneLines": 1,
            "averageMonthlyData": 593,
            "averageMonthlyCost": 65,
            "totalEtf": 0,
            "leasedPayoffFee": 0,
            "tradeInValue": 423,
            "recommendations": [
                {
                    "Id": "65",
                    "Carrier": "Att",
                    "Cost": 47,
                    "PerMbOverage": 0.15,
                    "AdditionalLineCharge": 15,
                    "DataIncluded": 1000,
                    "MaxLines": 1,
                    "RecommendationCost": 47
                },
                {
                    "Id": "27",
                    "Carrier": "Sprint",
                    "Cost": 30,
                    "PerMbOverage": 0.15,
                    "AdditionalLineCharge": 0,
                    "DataIncluded": 1000,
                    "MaxLines": 1,
                    "RecommendationCost": 30
                }
            ]
        };
        $scope.connected = true;
    */
    };

}]);