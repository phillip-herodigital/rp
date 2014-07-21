ngApp.directive('valBindMessages', ['validation', '$parse', '$sce', function (validation, $parse, $sce) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.valBindMessages);

            var disposeWatch = [
                scope.$watchCollection(attrs.valBindMessages, function (newValue) {
                    var target = validation.ensureValidation(scope).messages = {};

                    console.log(newValue);
                    
                    angular.forEach(newValue, function (entry) {
                        target[entry.memberName] = target[entry.memberName] || [];
                        target[entry.memberName].push($sce.trustAsHtml(entry.text));
                    });
                })
            ];

            element.on('$destroy', function () {
                angular.forEach(disposeWatch, function (d) { d(); });
            });
        }
    };
}]);
