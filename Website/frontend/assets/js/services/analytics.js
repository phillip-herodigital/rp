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
                    var count=0;
                    while (count <= 5) {
                        $timeout(function () {
                            if (window.ga && window.ga.getAll().length >= 1) {
                                var tracker = ga.getAll()[0];
                                for (var i = 0; i < arguments.length; i += 2) {
                                    tracker.set('dimension' + arguments[i], arguments[i + 1]);
                                }
                                tracker.send('event');
                                count = 5;
                            }                            
                        }, 1000);
                        count++;
                    }
                }
            } catch(e) {} //just eat any errors;
        }
    };

}]);