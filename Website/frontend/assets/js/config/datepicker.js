ngApp.config(['datepickerConfig', 'datepickerPopupConfig', function (datepickerConfig, datepickerPopupConfig) {
    datepickerConfig.formatYear = 'yy';
    datepickerConfig.showWeeks = false;

    datepickerPopupConfig.datepickerPopup = 'MM/dd/yyyy';
    datepickerPopupConfig.showButtonBar = false;

}]);