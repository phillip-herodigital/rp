jQuery(document).ready(function ($) {
    $('#SelectAllLanguages').click(function () {
        $('#Languages').find(':checkbox').attr('checked', this.checked);
    });

    $('#Languages').find(':checkbox').click(function () {
        var total = $('#Languages input').length;
        var checked = $('#Languages input:checked').length;
        $('#SelectAllLanguages').attr('checked', total == checked);
    });
});