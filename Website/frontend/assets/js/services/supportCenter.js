/*
 * Support Center Service
 *
 */
ngApp.factory('supportCenterService', [function () {
    var service = {
        category: "",
        faq: {},
        setCategory: function (category) {
            service.category = category;
        },
        getCategory: function () {
            return service.category;
        },
        setFaq: function (faq) {
            service.faq = faq;
        },
        getFaq: function () {
            return service.faq;
        }
    };

    return service;
}]);