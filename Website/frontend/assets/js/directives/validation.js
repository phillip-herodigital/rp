ngApp.directive('val', ['validation', '$compile', '$sce', function (validation, $compile, $sce) {
    var validationId = 0;

    function startsWith(string, start) { return string.slice(0, start.length) == start; };
    function camelCase(string) { return string.charAt(0).toLowerCase() + string.slice(1); };

    var buildValidatorsFromAttributes = function (attrs) {
        var keys = Object.keys(attrs).sort();
        var validators = {};
        for (var index in keys) {
            var key = keys[index];
            if (key == 'val' || key == 'valName' || !startsWith(key, 'val'))
                continue;
            var handled = false;
            for (var validator in validators) {
                if (startsWith(key, validator)) {
                    validators[validator].params[camelCase(key.substr(validator.length))] = attrs[key];
                    handled = true;
                    break;
                }
            }
            if (handled)
                continue;

            var keyName = camelCase(key.substr(3));
            var validate = validation.getValidator(keyName);
            if (validate) {
                validators[keyName] = {
                    name: keyName,
                    validate: validate,
                    message: attrs[key],
                    params: []
                };
            }
            else {
                console.log('WARNING: Unhandled validation attribute: ' + keyName);
            }
        }
        return validators;
    };

    // Attribute to run validation on an element
    var link = function (scope, element, attrs) {
        if (attrs['val'] != 'true')
            return;

        var validationFor = attrs['valName'];
        var validators = buildValidatorsFromAttributes(attrs);

        scope.$watch(
            function () { return element.val() },
            function (newValue) {
                scope.$$validation.data[validationFor] = newValue;
                scope.$$validation.errs[validationFor] = [];
                for (var key in validators)
                {
                    if (!validators[key].validate(newValue, validators[key].params))
                    {
                        scope.$$validation.errs[validationFor].push($sce.trustAsHtml(validators[key].message));
                    }
                }
            });
    };

    return {
        restrict: 'A',
        compile: function (compilingElement, compileAttrs) {
            if (compileAttrs['ngModel'])
                return {
                    post: link
                };

            compilingElement.attr('data-ng-model', '$$validation.data["' + compileAttrs['valName'] + '"]');

            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.$$validation = scope.$$validation || {};
                    scope.$$validation.data = scope.$$validation.data || {};
                    scope.$$validation.errs = scope.$$validation.errs || {};
                    scope.$$validation.data[compileAttrs['valName']] = iElement.val();
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    $compile(iElement)(scope);
                }
            };
        }
    };
}]);
