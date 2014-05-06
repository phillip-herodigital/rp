ngApp.factory("breakpoint", ['$window', '$rootScope', function ($window, $rootScope) {

    var sizes = [
         {
             'name': 'phone',
             'dimensions': [0, 767]
         },
         {
             'name': 'tablet',
             'dimensions': [768, 1024]
         },
         {
             'name': 'desktop',
             'dimensions': [1025, 9999]
         }
    ],
    selectedSize = null,
    setBreakpoint = function (winWidth) {
        for (var i = 0, len = sizes.length; i < len; i++) {
            if (winWidth > sizes[i].dimensions[0] && winWidth < sizes[i].dimensions[1]) {
                selectedSize = sizes[i].name;
            }
        }
    };

    setBreakpoint($window.innerWidth);

    $rootScope.$watch(function () {
        return $window.innerWidth;
    }, function (newValue, oldValue) {
        setBreakpoint(newValue);
    });

    window.onresize = function () {
        $rootScope.$apply();
    };

    return {
       getBreakpoint: function () {
            return selectedSize;
        }
    }

}]);