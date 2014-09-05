ngApp.factory('modalFactory', ['$modal', function ($modal) {
    return {
        open: function (customOpts) {

            var opts = {
                backdrop: true,
                keyboard: true
            }; // Default Modal Options
            angular.extend(opts, customOpts);

            if (!opts.template && !opts.templateUrl) {
                if (!customOpts.modalContent || !customOpts.modalContent.title || !customOpts.modalContent.body) {
                    console.error("If no temlate or templateUrl is provided, modalContent must be an object with a 'title' and 'body'.");
                    return;
                }
                var defaultTemplate = '<div class="modal-header">' +
                '    <a href="" ng-click="close()">Close</a>' +
                '    <h2>' + customOpts.modalContent.title + '</h2>' +
                '</div>' +
                '<div class="modal-body">' +
                customOpts.modalContent.body +
                '</div>' +
                '<div class="modal-footer">' +
                '    <button ng-click="close()">' + (customOpts.modalContent.button || 'Close') + '</button>' +
                '</div>';

                opts.template = defaultTemplate;
            }

            if (!opts.controller) {
                // If we don't pass in a conroller, set one up with a few default options
                opts.controller = function ($scope, $modalInstance) {
                    $scope.close = function (result) {
                        //$modalInstance.close(result);
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(opts);

        }
    }

}]);