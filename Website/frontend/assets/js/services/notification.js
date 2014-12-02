ngApp.factory('notificationService', ['$document', function ($document) {
    var className = 'notifications';

    function showNotification(subject, message) {
        var $elems = $document.find('.' + className);
        $elems.append('<div class="notice alert">' +
            '<a href="javascript:void(0)" class="remove"></a>' +
                '<div>' + 
                    '<h5>' + subject + '</h5>' +
                    '<p>' + message + '</p>' +
                '</div>' +
            '</div>');
    }

    $document.ready(function ($) {
        $('.' + className + ' .notice .remove').on('click', function () {
            $(this).parent().remove();
        });
    });
    return {
        notify: showNotification
    };
}]);