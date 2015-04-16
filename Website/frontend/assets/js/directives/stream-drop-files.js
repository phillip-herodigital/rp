ngApp.directive('streamDropFiles', ['$parse', function ($parse) {
    return {
        link: function (scope, element, attrs)
        {
            var filesProperty = $parse(attrs.streamDropFiles);
            var setFiles = function (newFiles) {
                scope.$apply(function () {
                    filesProperty.assign(scope, newFiles);
                });
            };
            
            function dragEnterLeave(evt) {
                evt.stopPropagation();
                evt.preventDefault();
            };

            element[0].addEventListener("dragleave", dragEnterLeave, false);
            element[0].addEventListener("dragover", dragEnterLeave, false);
            element[0].addEventListener('drop', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                setFiles(evt.dataTransfer.files);
            });
        }
    };
}]);