define([
    'sitecore',
    '/-/speak/v1/ecm/ServerRequest.js',
    '/-/speak/v1/ecm/constants.js'
],
function (
    sitecore,
    ServerRequest,
    constants
) {
    var defaultParams = {
        managerRootId: '',
        messageId: ''
    };

    function ReportDataService() { };

    _.extend(ReportDataService.prototype, {
        getKeysFormAncestor: function (params) {
            var defer = $.Deferred();
            if (params && params.managerRootId) {
                ServerRequest(constants.ServerRequests.EXPERIENCE_ANALYTICS_KEY, {
                    type: "GET",
                    data: _.extend({}, defaultParams, params),
                    success: _.bind(function(response) {
                        if (!response.error) {
                            defer.resolve(response.value);
                        } else {
                            defer.reject(response.error);
                        }
                    }, this)
                });
            } else {
                defer.resolve(null);
            }

            return defer.promise();
        }
    });

    return new ReportDataService();
});