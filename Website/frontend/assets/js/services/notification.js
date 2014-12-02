ngApp.factory('notificationService', ['$document', function ($document) {
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    var className = 'notifications';
    var tmpl = '<div class="notice alert">' +
            '<a href="javascript:void(0)" class="remove"></a>' +
                '<div>' +
                    '<h5>{{ subject }}</h5>' +
                    '<p>{{ message }}</p>' +
                '</div>' +
            '</div>';
    function showNotification(subject, message) {
        var $elems = $document.find('.' + className);
        $elems.append(
            _.template(tmpl)({
                subject: subject,
                message: message
            })
        );
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