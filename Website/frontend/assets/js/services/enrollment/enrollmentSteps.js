/*
    To navigate through the Enrollment process without the page controllers
    needing to know which steps are next. This will allow the main controller
    or any other controller to turn on and off steps as needed when new products are added.
*/
ngApp.factory('enrollmentStepsService', ['$rootScope', 'scrollService', 'jQuery', '$timeout', '$window', '$location', function ($rootScope, scrollService, jQuery, $timeout, $window, $location) {
    //Only currentStep is visible
    var currentStep = {};
    var initialFlow,
        currentFlow;

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
            'previous': ['accountInformation', 'verifyIdentity']
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
                'serviceInformation': 'utilityFlowService',
                'planSelection': 'utilityFlowPlans',
                'planSettings': 'accountInformation'
            }
    }

    var service = {
        setInitialFlow: function (flow) {
            initialFlow = flow;
            currentFlow = flow;
        },

        setFlow: function (flow, isNewFlow) {
            if (flows[currentFlow]) {
                // hide the steps from the old flow, since they won't really be occuring in that order and we don't want to scroll up to them
                angular.forEach(flows[currentFlow], function (state) {
                    if (state.isFlowSpecific) {
                        service.deActivateStep(state);
                    }
                });
            }
            currentFlow = flow;
            if (!isNewFlow && flows[currentFlow]) {
                // show the steps from the current flow
                angular.forEach(flows[currentFlow], function (state) {
                    state.isActive = true;
                });
            }
            return service;
        },

        setFromServerStep: function (expectedState) {
            if (expectedState == 'orderConfirmed')
                $window.location.href = '/account/enrollment-confirmation';
            else if (flows[currentFlow] && flows[currentFlow][expectedState]) {
                service.setStep(flows[currentFlow][expectedState]);
            } else {
                service.setStep(expectedState);
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
                steps[previousId].isActive = true;
                steps[previousId].isVisible = true;
                steps[previousId].canJumpTo = true;
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
            currentStep.isCurrent = true;
            service.activateStep(id);
            $location.hash('step-' + id);
        },

        /**
         * [scrollToStep description]
         * @param  {[type]} id
         * @return {[type]}
         */
        scrollToStep: function (id) {
            //Delay needs to be set to allow angular code to open section.
            if(service.isStepVisible(id)) {
                $timeout(function() {
                    scrollService.scrollTo(id, jQuery('header.site-header').height() * -1);
                }, 10);
            }
        },

        /**
         * [isStepVisible description]
         * @param  {[type]}  id
         * @return {Boolean}
         */
        isStepVisible: function (id) {
            return this.getStep(id).isVisible;
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
        if($location.hash() != '') {
            service.scrollToStep($location.hash().split('-')[1]);
        }
    });

    return service;
}]);