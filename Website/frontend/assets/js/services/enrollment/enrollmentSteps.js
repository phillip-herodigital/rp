/*
    To navigate through the Enrollment process without the page controllers
    needing to know which steps are next. This will allow the main controller
    or any other controller to turn on and off steps as needed when new products are added.
*/
ngApp.factory('enrollmentStepsService', ['scrollService', 'jQuery', '$timeout', function (scrollService, jQuery, $timeout) {
    //Only currentStep is visible
    var currentStep = '',
        currentStepIndex;
    var initialFlow,
        currentFlow;

    //List of steps for the enrollment process
    var steps = [
        { 
            'name': 'utilityFlowService',
            'isActive': false,
            'isVisible': false
        },
        { 
            'name': 'utilityFlowPlans',
            'isActive': false,
            'isVisible': false,
        },        
        { 
            'name': 'homelifeFlow',
            'isActive': false,
            'isVisible': false
        },
        { 
            'name': 'phoneFlow',
            'isActive': false,
            'isVisible': false 
        },
        { 
            'name': 'accountInformation', 
            'isActive': true,
            'isVisible': false
        }, 
        { 
            'name': 'verifyIdentity', 
            'isActive': true,
            'isVisible': false
        },
        { 
            'name': 'reviewOrder', 
            'isActive': true,
            'isVisible': false
        },
        { 
            'name': 'orderConfirmed', 
            'isActive': true,
            'isVisible': false
        }
    ];

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

        setFlow: function (flow) {
            if (flows[currentFlow]) {
                angular.forEach(flows[currentFlow], function (state) {
                    //We actually need to set the flow steps to active here
                    service.activateStep(state);
                });
            }
            currentFlow = flow;
            return service;
        },

        setFromServerStep: function (expectedState) {
            if (flows[currentFlow] && flows[currentFlow][expectedState]) {
                service.setFlow(currentFlow);
                service.setStep(flows[currentFlow][expectedState]);
            } else {
                service.setStep(expectedState);
            }
        },

        /**
         * [activateStep description]
         * @param  {[type]} name
         * @return {[type]}
         */
        activateStep: function (name) {
            console.log('activate', name);
            angular.forEach(steps, function(step, index) {
                if(step.name == name) {
                    steps[index].isActive = true;
                }
            });
        },
        
        /**
         * [activateStep description]
         * @param  {[type]} name
         * @return {[type]}
         */
        deActivateStep: function(name) {
            angular.forEach(steps, function(step, index) {
                if(step.name == name) {
                    steps[index].isActive = false;
                    steps[index].isVisible = false;
                }
            });
        },        

        /**
         * [nextStep description]
         * @param  {[type]} name
         * @return {[type]}
         */
        nextStep: function(name) {
            var savedStep = currentStepIndex;

            if(currentStepIndex == steps.length - 1) {
                return;
            }

            do {
                savedStep++;
            } while(steps[savedStep].isActive != true);

            if(savedStep < steps.length) {
                currentStep = steps[savedStep];
                currentStepIndex = savedStep;
                //Set the next step to true if it's active but not visible?
                if(!currentStep.isVisible) {
                    currentStep.isVisible = true;
                }
                this.scrollToStep(currentStep.name);
            }
        },

        /**
         * [previousStep description]
         * @param  {[type]} name
         * @return {[type]}
         */
        previousStep: function(name) {
            var savedStep = currentStepIndex;    
            
            if(currentStepIndex == 0) {
                return;
            }

            do {
                savedStep--;
            } while(steps[savedStep].isActive != true);

            if(savedStep >= 0) {
                currentStep = steps[savedStep];
                currentStepIndex = savedStep;
                this.scrollToStep(step.name);
            }
        },

        /**
         * [setStep description]
         * @param {[type]} name
         * @param {[type]} activate
         */
        setStep: function (name) {
            console.log('set step', name);
            angular.forEach(steps, function(step, index) {
                if(step.name == name) {
                    currentStep = step;
                    currentStepIndex = index;
                    step.isActive = true;
                    step.isVisible = true;
                    this.scrollToStep(step.name);
                } else {
                    //Keep the process a single page
                    //step.isActive = false;
                    step.isVisible = false;
                }
            }, this);
        },

        /**
         * [scrollToStep description]
         * @param  {[type]} name
         * @return {[type]}
         */
        scrollToStep: function (name) {
            console.log('scrollToStep', name);
            //Delay needs to be set to allow angular code to open section.
            if(this.isStepVisible(name)) {
                $timeout(function() {
                    scrollService.scrollTo(name, jQuery('header.site-header').height() * -1);
                }, 10);
            }
        },

        /**
         * [isStepVisible description]
         * @param  {[type]}  name
         * @return {Boolean}
         */
        isStepVisible: function(name) {
            return this.getStep(name).isVisible;
        },

        /**
         * [isStepActive description]
         * @param  {[type]}  name
         * @return {Boolean}
         */
        isStepActive: function(name) {
            return this.getStep(name).isActive;
        },

        /**
         * [getStep description]
         * @param  {[type]} name
         * @return {[type]}
         */
        getStep: function(name) {
            //come back and optimize this
            var step;
            
            angular.forEach(steps, function(item, index) {
                if(item.name == name) {
                    step = item;
                }
            });

            return step;
        },

        /**
         * [getSteps description]
         * @return {[type]}
         */
        getSteps: function() {
            return steps;
        },

        /**
         * [getStepsCount description]
         * @return {[type]}
         */
        getStepsCount: function() {
            return count.length;
        },

        /**
         * [getCurrentStep description]
         * @return {[type]}
         */
        getCurrentStep: function() {
            return currentStep;
        }
    };

    return service;
}]);