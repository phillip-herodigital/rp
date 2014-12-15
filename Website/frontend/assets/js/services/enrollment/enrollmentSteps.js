/*
    To navigate through the Enrollment process without the page controllers
    needing to know which steps are next. This will allow the main controller
    or any other controller to turn on and off steps as needed when new products are added.
*/
ngApp.factory('enrollmentStepsService', ['$rootScope', 'scrollService', 'jQuery', '$timeout', '$window', '$location', function ($rootScope, scrollService, jQuery, $timeout, $window, $location) {
    //Only currentStep is visible
    var currentStep = {};
    var initialFlow,
        currentFlow,
        isRenewal;

    //List of steps for the enrollment process
    var steps = {};
    angular.forEach([
        {
            'id': 'utilityFlowService',
            'isFlowSpecific': true,
            'isActive': false,
            'isVisible': false,
            'previous': []
        },
        {
            'id': 'utilityFlowPlans',
            'isFlowSpecific': true,
            'isActive': false,
            'isVisible': false,
            'previous': ['utilityFlowService']
        },
        {
            'id': 'homelifeFlow',
            'isFlowSpecific': true,
            'isActive': false,
            'isVisible': false,
            'previous': []
        },
        {
            'id': 'phoneFlow',
            'isFlowSpecific': true,
            'isActive': false,
            'isVisible': false,
            'previous': []
        },
        {
            'id': 'accountInformation',
            'isFlowSpecific': false,
            'isActive': true,
            'isVisible': false,
            'previous': []
        },
        {
            'id': 'verifyIdentity',
            'isFlowSpecific': false,
            'isActive': true,
            'isVisible': false,
            'previous': ['accountInformation']
        },
        {
            'id': 'reviewOrder',
            'isFlowSpecific': false,
            'isActive': true,
            'isVisible': false,
            'previous': ['accountInformation']
        },
        {
            'id': 'orderConfirmed',
            'isFlowSpecific': false,
            'isActive': true,
            'isVisible': false
        }
    ], function (step, index) { steps[step.id] = step; step.order = index; step.name = 'TRANSLATE ' + step.id; });

    var flows = {
        'utility':
            {
                'serviceInformation': {
                    name: 'utilityFlowService',
                    previous: []
                },
                'planSelection': {
                    name: 'utilityFlowPlans',
                    previous: ['utilityFlowService']
                },
                'planSettings': {
                    name: 'accountInformation',
                    previous: ['utilityFlowService', 'utilityFlowPlans']
                }
            }
    }

    var service = {
        timeRemaining: function () {
            return service.getCurrentStep().timeRemaining;
        },
        setTimeRemaining: function (id, value) {
            if (steps[id])
            steps[id].timeRemaining = value;
        },

        setRenewal: function () {
            delete steps.utilityFlowService;
            delete steps.accountInformation;
            delete steps.verifyIdentity;
            flows.utility = {
                'planSelection': {
                    name: 'utilityFlowPlans',
                    previous: []
                }
            };
            isRenewal = true;
        },

        setInitialFlow: function (flow) {
            initialFlow = flow;
            currentFlow = flow;
        },

        setFlow: function (flow, isNewFlow) {
            if (flows[currentFlow]) {
                // hide the steps from the old flow, since they won't really be occuring in that order and we don't want to scroll up to them
                angular.forEach(flows[currentFlow], function (flowStep) {
                    if (steps[flowStep.name].isFlowSpecific) {
                        service.deActivateStep(flowStep.name);
                    }
                });
            }
            currentFlow = flow;
            if (!isNewFlow && flows[currentFlow]) {
                // show the steps from the current flow in the nav
                angular.forEach(flows[currentFlow], function (flowStep) {
                    steps[flowStep.name].isActive = true;
                });
            }
            return service;
        },

        setFromServerStep: function (expectedState, isConfirmationPage) {
            if (isConfirmationPage) {
                if (expectedState != 'orderConfirmed') {
                    $window.location.href = '/enrollment';
                }
                return;
            }
            if (expectedState == 'orderConfirmed') {
                $window.location.href = '/enrollment/confirmation';
            }
            else if (expectedState == 'identityCheckHardStop') {
                $window.location.href = '/enrollment/please-contact';
            }
            else if (expectedState == 'errorHardStop') {
                $window.location.href = '/enrollment/please-contact';
            }
            else if (expectedState == 'planSettings' && isRenewal) {
                service.setStep('reviewOrder');
                service.setMaxStep('reviewOrder');
            }
            else if (flows[currentFlow] && flows[currentFlow][expectedState]) {
                for (var i = 0; i < flows[currentFlow][expectedState].previous.length; i++) {
                    var stateName = flows[currentFlow][expectedState].previous[i];
                    if (steps[stateName] && !steps[stateName].isVisible) {
                        // don't skip any steps
                        service.setStep(stateName);
                        return;
                    }
                }
                service.setStep(flows[currentFlow][expectedState].name);
                service.setMaxStep(flows[currentFlow][expectedState].name);
            } else {
                service.setStep(expectedState);
                service.setMaxStep(expectedState);
            }
        },

        /**
         * [activateStep description]
         * @param  {[type]} id
         * @return {[type]}
         */
        activateStep: function (id) {
            steps[id].isActive = true;
            steps[id].isVisible = true;
            steps[id].canJumpTo = true;
            angular.forEach(steps[id].previous, function (previousId) {
                if (steps[previousId]) {
                    steps[previousId].isActive = true;
                    steps[previousId].isVisible = true;
                    steps[previousId].canJumpTo = true;
                }
            });
        },
        
        /**
         * [activateStep description]
         * @param  {[type]} id
         * @return {[type]}
         */
        deActivateStep: function(id) {
            steps[id].isActive = false;
            steps[id].isVisible = false;
        },

        hideStep: function (id) {
            steps[id].isVisible = false;
            steps[id].canJumpTo = false;
        },

        setMaxStep: function (step) {
            if (!steps[step])
                return;
            var isFlowSpecific = steps[step].isFlowSpecific;
            angular.forEach(steps, function (value, key) {
                if (_.contains(value.previous, step) || (isFlowSpecific && !value.isFlowSpecific)) {
                    service.hideStep(key);
                }
            });
        },

        /**
         * [setStep description]
         * @param {[type]} id
         * @param {[type]} activate
         */
        setStep: function (id) {
            // We can jump back to the state we're in before setStep.
            currentStep.canJumpTo = true;
            angular.forEach(steps, function (step, index) {
                step.isCurrent = false;
            }, this);

            currentStep = steps[id];
            if (!currentStep)
                console.log('not found', id);
            currentStep.isCurrent = true;
            service.activateStep(id);
            this.scrollToStep(id, 'fast', function() {
                $timeout(function() {
                    $location.hash('step-' + id);
                }, 10);
            });
            //scroll first, then set hash
        },

        /**
         * [scrollToStep description]
         * @param  {[type]} id
         * @return {[type]}
         */
        scrollToStep: function (id, time, callback) {
            //Delay needs to be set to allow angular code to open section.
            if(service.isStepVisible(id)) {
                $timeout(function() {
                    scrollService.scrollTo(id, jQuery('header.site-header').height() * -1, time == 0 ? 0 : '750',  callback || angular.noop);
                }, 10, false);
            }
        },

        /**
         * [isStepVisible description]
         * @param  {[type]}  id
         * @return {Boolean}
         */
        isStepVisible: function (id) {
            var step = this.getStep(id);
            if (step)
                return step.isVisible;
            else
                return false;
        },

        /**
         * [getStep description]
         * @param  {[type]} id
         * @return {[type]}
         */
        getStep: function (id) {
            return steps[id];
        },

        /**
         * [getSteps description]
         * @return {[type]}
         */
        getSteps: function () {
            return steps;
        },

        /**
         * [getCurrentStep description]
         * @return {[type]}
         */
        getCurrentStep: function() {
            return currentStep;
        }
    };

    /*
        Allow for navigation through the process using back/forward buttons
        We're not using a hash that actually matches with an element ID to
        keep the browser from automatically scrolling.
     */
    $rootScope.$on('$locationChangeSuccess', function(event) {
        //Scroll to step, but don't actual animate it
        if($location.hash() != '') {
            service.scrollToStep($location.hash().split('-')[1], 0);
        }
    });

    return service;
}]);