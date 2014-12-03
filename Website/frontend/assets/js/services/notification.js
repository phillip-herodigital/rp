/*
 * Notification Service
 *
 * - className: The html class that the service binds to. Notifications will be 
 *   populated within any element that is decorated with this class name.
 *
 * - notify(subject, message, scope); Display a notification with at minumum a 
 *   subject and static message. Optionally a scope object can be provided, in
 *   which cases the contents of the message argument will be evaluated in the 
 *   context of the provided scope allowing curly brace/mustache style templates, e.g.
 *
 *   notificationService.notify('Hello', '<div>Hi, {{ name }}!</div>', {name: 'Morgan'});
 *
 *   will result in a message rendered like so: <div>Hi, Morgan!</div>
 *
 */
ngApp.factory('notificationService', ['$document', '$log', function ($document, $log) {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    var className = 'notifications';
    var tmpl = '<div class="notice alert">' +
                '<a href="javascript:void(0)" class="remove"></a>' +
                '<div>' +
                    '<h5>{{ _subject }}</h5>' +
                    '<p>{{ _message }}</p>' +
                '</div>' +
               '</div>';

    function showNotification(subject, message, scope) {
        var $elems = $document.find('.' + className);
        var notifiction = '';
        if (!!scope) {
            var template = _.template(tmpl)({
                _subject: subject,
                _message: message
            });
            try {
                notification = _.template(template)(scope);
            } catch (err) {
                $log.error("Unable to render template.", err);
                notification = template;
            }
        } else {
            notification = _.template(tmpl)({
                _subject: subject,
                _message: message
            });
        }
        $elems.append(notification);
    }

    $document.ready(function ($) {
        $('.' + className + ' .notice .remove').on('click', function () {
            $(this).parent().remove();
        });
    });

    return {
        notify: showNotification,
        className: className
    };
}]);