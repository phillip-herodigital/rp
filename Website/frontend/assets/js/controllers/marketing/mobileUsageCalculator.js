ngApp.controller('MobileUsageCalculatorCtrl', ['$scope', '$rootScope', '$http', '$location', 'mobileEnrollmentService','enrollmentCartService', '$timeout', function ($scope, $rootScope, $$http, $location, mobileEnrollmentService,enrollmentCartService, $timeout) {

    // Main Functionality
    // --------------------------------------------------

    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec($location.absUrl());
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.currentMobileLocationInfo = enrollmentCartService.getActiveService;

    $scope.SPID = getParameterByName("SPID");
    $scope.BC_ID = getParameterByName("BC_ID");
    $scope.RefSite = getParameterByName("RefSite");
    $scope.AccountType = getParameterByName("AccountType");
    $scope.recommendedPlanData = 0;

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    };
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    };

    $scope.getCarrierName = function(carrier) {
        var currentCarrier = _.find($scope.serverData.carriers, { key: carrier });
        return (currentCarrier && currentCarrier.name) ? currentCarrier.name : '';
    };

    /*$scope.selectCarrierConnect = function(carrier) {
        $scope.connect.carrier = carrier;
    };*/

    $scope.callValidas = function() {

        $scope.isLoading = true;
        $scope.validasErrors = null;

        $http({
            method: 'POST',
            url: '/api/marketing/validas',
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
            if (data && data.success !== false) {
                $scope.connect.validas = data;
                $scope.connected = true;
            } else {
                if (data && data.messages) {
                    $scope.validasErrors = data.messages;
                } else {
                    $scope.validasErrors = ["A system error occurred. Please try again later."];
                }
            }
        }).error(function(data, status, headers, config) {
            $scope.isLoading = false;
            if (data && data.messages) {
                $scope.validasErrors = data.messages;
            } else {
                $scope.validasErrors = ["A system error occurred. Please try again later."];
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
        if (!$scope.getCarrier(carrier).showRecommendations) {
            return false; // disable carrier recommendations if setting is turned off
        }
        if($scope.currentTab === 'connect.tpl.html') {
            return $scope.getValidasRecommendation(carrier);
        } else {
            return $scope.getManualRecommendation(carrier);
        }
    };

    $scope.getMonthlyTotal = function(planId) {
        var numLines, plan;

        if ($scope.currentTab === 'connect.tpl.html') {
            if(typeof($scope.connect.validas) === 'undefined') { return false; }
            numLines = $scope.connect.validas.phoneLines;
        } else {
            numLines = $scope.manualCalculator.lines;
        }
        plan = $scope.getPlanByPlanId(planId);

        if(typeof(plan) === 'undefined') { return false; }

        return parseFloat(plan.price) + (numLines - 1) * $scope.getCarrier('sprint').fees.extraLineFee
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

    $scope.getTotalSavings = function(carrier) {
        if(typeof($scope.connect.validas) === 'undefined' || !$scope.hasRecommendationForCarrier(carrier)) { return 0; }

        //return ($scope.connect.validas.averageMonthlyCost - $scope.getValidasRecommendation(carrier).price) * $scope.formData.selectedTimeframe;
        return ($scope.connect.validas.averageMonthlyCost - $scope.getMonthlyTotal($scope.getValidasRecommendation(carrier).planId)) * $scope.formData.selectedTimeframe;
    };

    $scope.calculateTCO = function(plan) {
        var total = 0,
        monthlyPrice = 0,
        activationFee = 0;

        if($scope.isActiveTab('manual.tpl.html') || !$scope.connect.validas) {
            return;
        }

        if(plan !== 'currentPlan' && !$scope.hasRecommendationForCarrier(plan)){
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

    $scope.totalSavingsForCarrier = function(carrier) {
        if(typeof($scope.connect.validas) === 'undefined' || !$scope.hasRecommendationForCarrier(carrier)) { return 0; }
        
        var fees = $scope.connect.validas.leasedPayoffFee + $scope.connect.validas.totalEtf +
                    ($scope.connect.validas.phoneLines * $scope.getCarrier(carrier).fees.activationFee);

        //var savings = $scope.calculateTCO('currentPlan') - $scope.calculateTCO(carrier);
        var savings = $scope.getTotalSavings(carrier);

        return parseFloat($scope.connect.validas.tradeInValue) + savings - fees; 
    };

    $scope.hasSavingsForCarrier = function(carrier) {
        return ($scope.totalSavingsForCarrier(carrier) > 0) ? true : false;
    };

    // Manual Calculator
    // --------------------------------------------------

    $scope.getManualRecommendation = function(carrier) {
        return findBestPlanFromCarrier(carrier);
    };

    $scope.calculatorTotalInGB = function(ceil) {
        if(typeof(ceil) !== 'undefined') {
            return Math.min( ($scope.calculatorTotal / (1000 * 1000) ).toFixed(1), ceil );
        } else {
             return ($scope.calculatorTotal / (1000 * 1000) ).toFixed(1);
        }
    };

    $scope.calculatorTotalInPct = function() {
        return ($scope.calculatorTotalInGB(10) * 12.5).toFixed();
    };

    $scope.calculatorRecommendationInGB = function() {
        var gb = $scope.calculatorTotalInGB(10);
        if(gb == 0) { return 0; }
        return Math.min(Math.ceil($scope.calculatorTotalInGB(10) * 1.1), 10).toFixed();
    };

    $scope.calculatorRecommendationInPct = function() {
        return ( ( $scope.calculatorRecommendationInGB() / 10 ) * 100).toFixed();
    };      

    $scope.recommendedPlanData = function(carrier) {
        var data = $scope.getManualRecommendation(carrier).data;
        return data === 1000000 ? 'Unlimited' : parseInt(data).toFixed(0) + 'GB';
    }

    $scope.estimateLabelLeft = function() {
        return Math.max($('.estimate').width() - $('.estimatedDataLabel').width() - 15, 0);
    };

    $scope.$watch('manualCalculator', function(newVal, oldVal) {
        var subtotal = 0;
        for(var key in $scope.serverData.dataMultipliers) {
            subtotal += ($scope.serverData.dataMultipliers[key] * $scope.manualCalculator[key] * (($scope.manualCalculator.timeframe[key] == "day") ? 30 : 1))
        }
        $scope.calculatorTotal = subtotal * $scope.manualCalculator.lines;
        if ($scope.calculatorTotal == 0 ) {
            $scope.recommendedPlanData = 0;
        }
        else if ($scope.calculatorTotal < 2000000) {
            $scope.recommendedPlanData = 2;
        }
        else if ($scope.calculatorTotal < 4000000) {
            $scope.recommendedPlanData = 4;
        }
        else if ($scope.calculatorTotal < 6000000) {
            $scope.recommendedPlanData = 6;
        }
        else {
            $scope.recommendedPlanData = "Unlimited";
        }
    }, true);

    $scope.selectPlan = function (planId) {
        console.log(planId);
    };

    var getBestPlanFromData = function (coll){
        var bestPlan;

        bestPlan = _.find(coll, function (plan) {
            return plan.data > $scope.calculatorTotalInGB(); // no ceiling, use the real value
        });

        return bestPlan ? bestPlan : _.max(coll, function(plan){ return plan.data });
    }
    var findBestPlanFromCarrier = function(carrier) {
        var bestPlan, coll = null;

        if($scope.manualCalculator.lines == 1) {
            coll = $scope.serverData.recommendedPlans[carrier].individual;
        } else {
            coll = $scope.serverData.recommendedPlans[carrier].group;
        }
        
        if (!coll.length) {
            return;
        }

        bestPlan = _.find(coll, function(plan) {
            return plan.data > $scope.calculatorTotalInGB(); // no ceiling, use the real value
        });

        return bestPlan ? bestPlan : _.max(coll, function(plan){ return plan.data });
    };

    var findBestActivePlanFromCarrier = function (carrier) {
        var offers = $scope.currentMobileLocationInfo().offerInformationByType[0].value.availableOffers;
        offers = _.sortBy(offers, function (offer) {
            return offer.data;
        });

        return getBestPlanFromData(offers);
    }

    $scope.filterPlans = function (plan) {
        if (plan.data == '2' || plan.data == '4') {
            return !plan.includesInternational;
        }
        else {
            return true;
        }
    };

    var cleanAndSortManualPlanCollection = function(coll) {
        _(coll).map(function(plan) {
            if(plan.data.toLowerCase() === 'unlimited') {
                plan.data = 1000000;
            } else {
                plan.data = parseInt(plan.data, 10);
            }
            plan.price = parseFloat(plan.price);
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

        $scope.serverData.recommendedPlans.sprint.individual = cleanAndSortManualPlanCollection($scope.serverData.recommendedPlans.sprint.individual);

        // Manual Calculator
        // --------------------------------------------------

        $scope.sliderVals = $scope.serverData.sliderValues;

        $scope.manualCalculator = {
            lines: 1,
            emails: 0,
            pictures: 0,
            music: 0,
            video: 0,
            surfing: 0,
            timeframe: {
                emails: 'month',
                pictures: 'month',
                music: 'month',
                video: 'month',
                surfing: 'month'
            }
        };

        $scope.getSliderOptions = function (type) {
            var ret = {
                orientation: 'horizontal',
                min: 0,
                max: (type == "music" || type == "video") ? 3600 : 3000,
                step: (type == "music" || type == "video") ? 60 : 20,
                range: 'min'
            };
            if ($scope.manualCalculator.timeframe[type] == "day") {
                ret.max = (type == "music" || type == "video") ? 120 : 100;
                ret.step = 2;
            }
            return ret;
        }
        
        $scope.getSliderLabel = function (type, midOrMax) {
            var ret;
            if ($scope.manualCalculator.timeframe[type] == "day") {
                switch(type) {
                    case "music":
                    case "video":
                        ret = 1;
                        break;
                    default:
                        ret = 50;
                        break;
                }
            } else {
                switch (type) {
                    case "music":
                    case "video":
                        ret = 30;
                        break;
                    default:
                        ret = 1500;
                        break;
                }
            }

            if (midOrMax == "max") {
                ret = ret * 2;
            }
            return ret;
        };
        $scope.$watch('manualCalculator.timeframe', function (newVal, oldVal) {
            $timeout(function () {
                for (var i = 0, type; type = ['emails', 'pictures', 'music', 'video', 'surfing'][i]; i++) {
                    if (newVal[type] != oldVal[type]) {
                        if (newVal[type] == "day") {
                            $scope.manualCalculator[type] = $scope.manualCalculator[type] / 30;
                        } else {
                            $scope.manualCalculator[type] = $scope.manualCalculator[type] * 30;
                        }
                    }
                }
            }, 1);
        }, true);
        
        $scope.setMobilePlanID = function(){
            var planID = findBestActivePlanFromCarrier($scope.mobileEnrollmentService.selectedNetwork.value).id;
            $rootScope.$broadcast('MobilePlanId-set', { MobilePlanID: planID });
        }

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
        */
    
        /*$scope.connect.validas = {
            "averageMonthlyCost": 120,
            "averageMonthlyData": 2608,
            "billingCount": 1,
            "leasedPayoffFee": 0,
            "network": "att",
            "phoneLines": 2,
            "recommendations": [
                {
                    "AdditionalLineCharge": 15,
                    "Carrier": "Sprint",
                    "Cost": 65,
                    "DataIncluded": 5000,
                    "Id": "56",
                    "MaxLines": 10,
                    "PerMbOverage": 0.015,
                    "RecommendationCost": 65
                }
            ],
            "totalEtf": 0,
            "tradeInValue": "42.95"
        };
        $scope.connected = true;*/
    

    };

}]);