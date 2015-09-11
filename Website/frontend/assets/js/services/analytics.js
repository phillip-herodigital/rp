ngApp.factory('analytics', ['$timeout', function ($timeout) {

    return {
        sendVariables: function () {
            try
            {
                if (window.ga && window.ga.getAll().length >= 1) {
                    var tracker = ga.getAll()[0];
                    for (var i = 0; i < arguments.length; i += 2) {
                        tracker.set('dimension' + arguments[i], arguments[i + 1]);
                    }
                    tracker.send('event');
                } else {
                    var tries = 0;
                    var sendDimension = function(arguments) {
                        if (window.ga && window.ga.getAll().length >= 1) {
                            var tracker = ga.getAll()[0];
                            for (var i = 0; i < arguments.length; i += 2) {
                                tracker.set('dimension' + arguments[i], arguments[i + 1]);
                            }
                            tracker.send('event');
                            $timeout.cancel(sendDimension);
                        }
                        if (tries > 100) {
                            $timeout.cancel(sendDimension);
                        }
                        tries++;
                    };
                    $timeout(sendDimension.bind(null, arguments), 2500); 
                }
            } catch(e) {} //just eat any errors;
        }
    };

}]);