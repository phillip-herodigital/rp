ngApp.controller('MobileUsageCalculatorCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.att = function() {
       return  _.find(Carriers, function(carrier){ return carrier.key === 'att'})
    };

    $scope.sprint = function() {
       return  _.find(Carriers, function(carrier){ return carrier.key === 'sprint'})
    };

    $scope.verizon = function() {
       return  _.find(Carriers, function(carrier){ return carrier.key === 'verizon'})
    };

    $scope.tmobile = function() {
       return  _.find(Carriers, function(carrier){ return carrier.key === 'tmobile'})
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

    $scope.getSprintRecommendation = function() {
        if($scope.currentTab === 'connect.tpl.html') {
            return $scope.getRecommendationForCarrier('sprint');
        } else {
            return $scope.findBestPlanFromCarrier('sprint')
        }
    };

    $scope.hasSprintRecommendation = function() {
        return $scope.getSprintRecommendation() != null;
    };

    $scope.getAttRecommendation = function() {
        if($scope.currentTab === 'connect.tpl.html') {
            return $scope.getRecommendationForCarrier('att');
        } else {
            return $scope.findBestPlanFromCarrier('att');
        }
    };

    $scope.hasAttRecommendation = function() {
        return $scope.getAttRecommendation() != null;
    };

    $scope.getRecommendationForCarrier = function(carrier) {
        if(typeof($scope.connect.validas) === 'undefined') { return false; }

        var validasPlan = _.find($scope.connect.validas.recommendations, function(n, i) {
            return n.Carrier.toLowerCase() === carrier.toLowerCase();
        });

        if(validasPlan) {
            return carrier == 'sprint' ? $scope.getSprintPlanByPlanId(validasPlan.Id) : $scope.getAttPlanByPlanId(validasPlan.Id);
        } else {
            return null;
        }
    };

    $scope.findBestPlanFromCarrier = function(carrier) {
        var coll = null;

        if($scope.manualCalculator.lines == 1) {
            if(carrier === 'sprint') {
                coll = $scope.sprintRecommendedConsumerPlans;
            } else {
                coll = $scope.attRecommendedConsumerPlans;
            }
        } else if(carrier === 'sprint') {
            coll = $scope.sprintRecommendedGroupPlans;
        }
        
        if(coll == null) { return coll; }

        return _.find(coll, function(plan) {
            return plan.data > $scope.calculatorTotalInGB(); // no ceiling, use the real value
        });
    };

    $scope.attPlans = function() {
        return $scope.plansForCarrier('att');
    };

    $scope.sprintPlans = function() {
        return $scope.plansForCarrier('sprint');
    };

    $scope.plansForCarrier = function(carrier) {
        return _.find(DataPlans.plans, function(n){return n.carrier.toLowerCase() === carrier.toLowerCase();}).plans;
    };

    $scope.getAttPlanById = function(id) {
        return _.find($scope.attPlans(), function(n){return n.id === id;});
    };

    $scope.getSprintPlanById = function(id) {
        return _.find($scope.sprintPlans(), function(n){return n.id === id;});
    };
 
    $scope.getAttPlanByPlanId = function(id) {
        return _.find($scope.attPlans(), function(n){return n.planId === id;});
    };

    $scope.getSprintPlanByPlanId = function(id) {
        return _.find($scope.sprintPlans(), function(n){return n.planId === id;});
    };

    $scope.calculateTCO = function(plan) {
        var total = 0,
        monthlyPrice = 0,
        activationFee = 0;

        if (!$scope.connect.validas) {
            return;
        }

        if (plan == 'att') {
            monthlyPrice = $scope.getAttRecommendation().price;
            extraLineFee = ($scope.connect.validas.phoneLines - 1) * $scope.att().fees.consumer.group.extraLineFee;
            monthlyPrice += extraLineFee;
            activationFee = $scope.sprint().fees.consumer.individual.activation;
        } else if (plan == 'sprint') {
            monthlyPrice = $scope.getSprintRecommendation().price;
            extraLineFee = ($scope.connect.validas.phoneLines - 1) * $scope.sprint().fees.consumer.group.extraLineFee;
            monthlyPrice += extraLineFee;
            activationFee = $scope.att().fees.consumer.individual.activation;
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

    $scope.cleanAndSortPlanCollection = function(coll) {
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
 
    $scope.setLines = function(lines) {
        $scope.manualCalculator.lines = lines;
    };

    $scope.recalculate = function() {

        var subtotal = 0;
        for(var key in $scope.serverData.dataMultipliers) {
            subtotal += ( $scope.serverData.dataMultipliers[key] * $scope.sliderVals[$scope.manualCalculator[key]] )
        }

        $scope.calculatorTotal = subtotal * $scope.manualCalculator.lines;

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
    }

    $scope.recommendedLabelLeft = function() {
        return Math.max($('.frame .recommended').width() - $('.recommendedLabelContainer .recommended').width() - 5, 0);
    };

    $scope.$watch('manualCalculator', function(newVal, oldVal) {
        $scope.recalculate();
    }, true);

    $scope.init = function(serverData) {

        $scope.serverData = serverData;

        $scope.isLoading = false;

        $scope.tabs = UsageCalculator.tabs;
        $scope.currentTab = UsageCalculator.currentTab;

        $scope.sliderVals = $scope.serverData.sliderValues;

        $scope.connected = false;

        $scope.connect = {
            acceptTermsCheckbox: false
        };

        $scope.calculatorTotal = 0;

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

        $scope.showBreakdown = false;

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

        $scope.attRecommendedConsumerPlans    = [];
        $scope.sprintRecommendedConsumerPlans = [];
        $scope.sprintRecommendedGroupPlans    = [];

        _.forEach(UsageCalculator.attRecommendedConsumerPlanIds.split('|'), function(id) {
            $scope.attRecommendedConsumerPlans.push($scope.getAttPlanById(id));
        });
        $scope.attRecommendedConsumerPlans = $scope.cleanAndSortPlanCollection($scope.attRecommendedConsumerPlans);

        _.forEach(UsageCalculator.sprintRecommendedConsumerPlanIds.split('|'), function(id) {
            $scope.sprintRecommendedConsumerPlans.push($scope.getSprintPlanById(id));
        });
        $scope.sprintRecommendedConsumerPlans = $scope.cleanAndSortPlanCollection($scope.sprintRecommendedConsumerPlans);

        _.forEach(UsageCalculator.sprintRecommendedGroupPlanIds.split('|'), function(id) {
            $scope.sprintRecommendedGroupPlans.push($scope.getSprintPlanById(id));
        });
        $scope.sprintRecommendedGroupPlans = $scope.cleanAndSortPlanCollection($scope.sprintRecommendedGroupPlans);






        $scope.connect.username = "5164496292";
        $scope.connect.password = "37Beetlestone";

        /*
        $scope.connect.validas = {
            "billingCount": 1,
            "network": "att",
            "phoneLines": 1,
            "averageMonthlyData": 593,
            "averageMonthlyCost": 65,
            "totalEtf": 0,
            "leasedPayoffFee": 0,
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
        $scope.connected = true;*/

    };

}]);