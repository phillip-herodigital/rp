define(["sitecore"], function (_sc) {
    _sc.Factories.createBaseComponent({
        name: "AccountInformation",
        base: "ControlBase",
        selector: ".sc-accountInformation",
        events: {
            "click .logout": "logout"
        },
        logout: function (e) {
            e.preventDefault();
            // Disable cache to make sure that URL is always "followed"
            // and the logout function gets executed on the server
            $.ajax({
                url: $(e.currentTarget).attr("href"),
                cache: false,
            }).done(function (data) {
                var data = JSON.parse(data);
                window.location = data.Redirect;
            });
        }
    });
});
