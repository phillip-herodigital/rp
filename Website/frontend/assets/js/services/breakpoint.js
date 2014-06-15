ngApp.factory("breakpoint", ['$window', '$rootScope', function ($window, $rootScope) {

    var retObj = {
        breakpoint: null,
        windowWidth: $window.innerWidth,
        getBreakpoint: function () {
            return retObj.breakpoint;
        }
    },
    sizes = [
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
    updateValues = function (winWidth) {
        retObj.windowWidth = winWidth;
        for (var i = 0, len = sizes.length; i < len; i++) {
            if (winWidth > sizes[i].dimensions[0] && winWidth < sizes[i].dimensions[1]) {
                retObj.breakpoint = sizes[i];
            }
        }
    };

    updateValues($window.innerWidth);

    $rootScope.$watch(function () {
        return $window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }, function (newValue, oldValue) {
        updateValues(newValue);
    });

    window.onresize = function () {
        $rootScope.$apply();
    };

    return retObj;

}]);