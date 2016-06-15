(function() {
    var isBrowser = typeof window !== "undefined",
        root = isBrowser ? window : global,
        speak = root.Sitecore.Speak,
        defaultParams = {
            userProfileApiUrl: "/api/sitecore/Settings/",
            userProfileApiUpdateMethod: "SetUserProfileKey"
        },
        saveState = function(userProfileKey, userProfileState, done) {

            if (!userProfileKey) {
                throw new Error("Please provide a valid userProfileKey");
            }

            if (userProfileState && !speak.utils.is.an.object(userProfileState)) {
                throw new Error("Please provide a valid state to the UserProfileState property - the state must be an object");
            }

            var value = JSON.stringify(userProfileState),
                token = speak.utils.security.antiForgery.getAntiForgeryToken();

            var ajaxOptions = {
                url: defaultParams.userProfileApiUrl + defaultParams.userProfileApiUpdateMethod,
                type: "POST",
                dataType: "text",
                data: {
                    key: userProfileKey,
                    value: value
                }
            };

            ajaxOptions.data[token.formKey] = token.value;

            var self = this;

            $.ajax(ajaxOptions).done(done);
        };


    if (isBrowser && Sitecore) {
        Sitecore.Speak.module("userProfile", {
            saveState: saveState
        });
    } else {
        exports = module.exports = UserProfile;
    }
})();
