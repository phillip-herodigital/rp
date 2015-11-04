ngApp.directive('reCaptcha', ['$document', '$timeout', 'reCAPTCHA', function ($document, $timeout, reCAPTCHA) {

    return {
        restrict: 'A',
        require: "?^^form",
        scope: {
            response: '=?ngModel',
            key: '=',
            theme: '=?',
            size: '=?',
            tabindex: '=?',
            onCreate: '&',
            onSuccess: '&',
            onExpire: '&'
        },
        link: function (scope, elm, attrs, ctrl) {
            scope.widgetId = null;

            var sessionTimeout;
            var removeCreationListener = scope.$watch('key', function (key) {

                var callback = function (gRecaptchaResponse) {
                    // Safe $apply
                    $timeout(function () {
                        if(ctrl){
                            ctrl.$setValidity('recaptcha',true);
                        }
                        scope.response = gRecaptchaResponse;
                        // Notify about the response availability
                        scope.onSuccess({response: gRecaptchaResponse, widgetId: scope.widgetId});
                    });

                    // captcha session lasts 2 mins after set.
                    sessionTimeout = $timeout(function (){
                        if(ctrl){
                            ctrl.$setValidity('recaptcha',false);
                        }
                        scope.response = "";
                        // Notify about the response availability
                        scope.onExpire({widgetId: scope.widgetId});
                    }, 2 * 60 * 1000);
                };

                reCAPTCHA.create(elm[0], callback, {

                    theme: scope.theme || attrs.theme || null,
                    tabindex: scope.tabindex || attrs.tabindex || null,
                    size: scope.size || attrs.size || null

                }).then(function (widgetId) {
                    // The widget has been created
                    if(ctrl){
                        ctrl.$setValidity('recaptcha',false);
                    }
                    scope.widgetId = widgetId;
                    scope.onCreate({widgetId: widgetId});

                    scope.$on('$destroy', destroy);

                });

                // Remove this listener to avoid creating the widget more than once.
                removeCreationListener();
            });

            function destroy() {
              if (ctrl) {
                // reset the validity of the form if we were removed
                ctrl.$setValidity('recaptcha', null);
              }
              if (sessionTimeout) {
                // don't trigger the session timeout if we are no longer active
                $timeout.cancel(sessionTimeout);
                sessionTimeout = null;
              }
              cleanup();
            }

            function cleanup(){
              // removes elements reCaptcha added.
              angular.element($document[0].querySelectorAll('.pls-container')).parent().remove();
            }
        }
    };

}]);