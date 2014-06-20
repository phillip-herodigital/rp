// This is intended to add functionality to the datepicker so we can have custom classes per date.
ngApp.directive('datepickerDateClass', [function () {
    return {
        restrict: 'A',
        require: 'datepicker',
        link: function (scope, element, attr, ctrl) {
            var importantScope = scope;
            if (attr['datepickerDateClassScope']) {
                while (importantScope && importantScope.$id != attr['datepickerDateClassScope']) {
                    importantScope = importantScope.$parent;
                }
            }

            var originalCreateDate = ctrl.createDateObject;
            ctrl.createDateObject = function (date, format) {
                var dt = originalCreateDate.call(ctrl, date, format);
                var temp = dt.combine;
                dt.combine = function (values) {
                    if (temp)
                        values = temp(value);
                    if (attr['datepickerDateClass']) {
                        var customClass = importantScope.$eval(attr['datepickerDateClass'], { date: date });
                        if (customClass != null) {
                            values = angular.extend(customClass, values);
                        }
                    }
                    return values;
                };
                return dt;
            };
        }
    };
}])
ngApp.directive('daypicker', [function () {
    return {
        restrict: 'AE',
        require: '^datepicker',
        link: function (scope, element, attr, ctrl) {
            var originalCreateDate = ctrl.createDateObject;
            ctrl.createDateObject = function (date, format) {
                var dt = originalCreateDate.call(ctrl, date, format);
                if (!dt.combine) {
                    dt.combine = function (values) {
                        return values;
                    };
                }
                return dt;
            };
        }
    };
}]).run(["$templateCache", function ($templateCache) {
    // Same as the original ui-bootstrap-tpls except the class is extended
    $templateCache.put("template/datepicker/day.html",
      "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
      "  <thead>\n" +
      "    <tr>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
      "      <th colspan=\"{{5 + showWeeks}}\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
      "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
      "    </tr>\n" +
      "    <tr>\n" +
      "      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
      "      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{label.abbr}}</small></th>\n" +
      "    </tr>\n" +
      "  </thead>\n" +
      "  <tbody>\n" +
      "    <tr ng-repeat=\"row in rows track by $index\">\n" +
      "      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
      "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
      "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"dt.combine({ 'btn-info': dt.selected, active: isActive(dt) })\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary, 'text-info': dt.current}\">{{dt.label}}</span></button>\n" +
      "      </td>\n" +
      "    </tr>\n" +
      "  </tbody>\n" +
      "</table>\n" +
      "");
}]);