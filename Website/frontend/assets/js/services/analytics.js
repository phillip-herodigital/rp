ngApp.factory('analytics', [function () {

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
                }
            } catch(e) {} //just eat any errors;
        }
    };

}]);