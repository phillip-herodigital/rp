ngApp.factory('enrollmentStepsService', [function () {
    //Only currentStep is visible
    var currentStep,
        currentStepIndex;

    //This is the list of steps, false means inactive
    var steps = [
        { 
            'name': 'utilityFlow',
            'active': false 
        },
        { 
            'name': 'homelifeFlow',
            'active': false 
        },
        { 
            'name', 'phoneFlow',
            'active': false 
        },
        { 
            'name': 'accountInformation', 
            'active': true 
        }, 
        { 
            'name': 'verifyIdentity', 
            'active': true 
        },
        { 
            'name': 'completeOrder', 
            'active': true 
        },
        { 
            'name': 'confirmOrder', 
            'active': true 
        }
    ];

    /**
     * Scroll to ID
     * 
     * @param {string} id       //DOM id of element to scroll to
     * @param {int} offset      //Offset to add padding for adjusting position
     */
    return {
        activateStep: function(name) {
            angular.forEach(steps, function(step) {
                if(step.name == name) {
                    steps[name] = true;
                }
            });
        },
        nextStep: function(name) {
            while(steps[currentStepIndex].active != true) { 
                currentStepIndex++;
            }

            currentStep = steps[currentStepIndex];
        },
        previousStep: function(name) {
            while(steps[currentStepIndex].active != true) { 
                currentStepIndex--;
            }

            currentStep = steps[currentStepIndex];
        },
        setStep: function(name) {
            angular.forEach(steps, function(step, index) {
                if(step.name == name) {
                   currentStep = step;
                   currentStepIndex = index;
                }
            });            
        },
        currentStep: currentStep
    };
}]);

//product flow
    //utility
    //homelife
    //phone
//rest of flow