ngApp.factory('notificationService', ['$document', function ($document) {

    var Levels = {INFO: 0, WARN: 1, ERROR: 2, CRITICAL: 3};
    var className = 'notification-area';

    function showNotification(subject, message, level) {
        var $elems = $document.find('.' + className);
        decorateElement($elems, level);
        $elems.html("<h1>" + subject + "</h1><p>" + message + "</p>");
    }

    function decorateElement($elements, level) { };

    return {
        notify: function (subject, message, level) {
            if (!level && level !== 0) {
                return showNotification(subject, message, Levels.INFO);
            } else {
                return showNotification(subject, message, level);
            }
        },
        level: Levels
    };
}]);