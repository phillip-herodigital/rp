define([
    "sitecore"
], function(
    sitecore
) {
    $(document)
        .ajaxError(function(e, jqXHR) {
            switch (jqXHR.status) {
            case 500:
                sitecore.trigger('ajax:error', { id: 'ajax.error.500', text: sitecore.Resources.Dictionary.translate("ECM.WeAreVerySorryButThereHasBeenAProblem"), actions: [], closable: true });
                break;
            case 403:
                console.error("Not logged in, will reload page");
                window.top.location.reload(true);
                break;
            }
        }).ajaxSuccess(function(e, jqXHR) {
            var response = jqXHR.responseJSON,
                defaultNotificationEvent = 'ajax:error';

            if (!response) {
                return;
            }

            if (response.error && response.errorMessage) {
                var error = {
                    id: 'ajax.server.error',
                    text: response.errorMessage,
                    actions: [],
                    closable: true
                };

                if (response.actions) {
                    error.actions = [{ text: response.actions[0].Key, action: response.actions[0].Value }];
                }
                sitecore.trigger(response.notificationEvent || defaultNotificationEvent, error);
            }
        });

    var ajaxDefaults = {
            type: "POST",
            async: true
        },
        ajaxUrlPrefix = '/sitecore/api/ssc/';

    function serverRequest(name, params) {
        if ($.type(name) === 'object') {
            params = name;
            name = null;
        }
        params = _.extend(_.clone(ajaxDefaults), params && $.type(params) === "object" ? params : {});

        if (name) {
            params.url = ajaxUrlPrefix + name;
        }

        $.ajax(params);
    }

    return serverRequest;
});