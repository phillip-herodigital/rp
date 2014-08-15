function showGlobalSpinner(elemId) {
    if (!elemId) {
        $('form:first').append('<input type="hidden" id="hidden_spinner" />');
        elemId = 'hidden_spinner';
    }
    $('#' + elemId).spinner({ 'type': 'global' });
    $('#' + elemId).spinner('display');
}

function showSpinner(elemId, options) {
    if (!elemId) {
        $('form:first').append('<input type="hidden" id="hidden_spinner" />');
        elemId = 'hidden_spinner';
    }
    $('#' + elemId).spinner(options);
    $('#' + elemId).spinner('display');
}

function InitDetailListSpinner(detailListId) {
    $(document).ready(function () {
        $('#' + detailListId).on('onBeforeSelectRow', function () {
            //showGlobalSpinner(detailListId);
            $('body').trigger('click');
        });

    });
}﻿