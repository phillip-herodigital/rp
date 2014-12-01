ngApp.factory('notificationService', ['$document', function ($document) {
    var className = 'notifications';

    function showNotification(subject, message) {
        var $elems = $document.find('.' + className);
        $elems.append('<div class="message">' +
            '<a href="javascript:void(0)" class="remove"><img alt="Remove" src="#"></a>' +
                '<div>' + 
                    '<h5>' + subject + '</h5>' +
                    '<p>' + message + '</p>' +
                '</div>' +
            '</div>');
    }

    $document.ready(function ($) {
        $('.' + className + ' .message .remove').on('click', function () {
            $(this).parent().remove();
        });
    });
    return {
        notify: showNotification
    };
}]);