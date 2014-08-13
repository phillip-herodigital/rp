var recipientsDetailList = {
    detailListId: null,
    selectedRecipientHiddenInput: null,

    registerControls: function (detailListId, selectedRecipientHiddenInput) {
        this.detailListId = detailListId;
        this.selectedRecipientHiddenInput = selectedRecipientHiddenInput;
    },
    
    updateHiddenUserNameField: function (gridObject, rowId) {
        if (!this.detailListId || !this.selectedRecipientHiddenInput) {
            return;
        }

        var detailList = $('#' + this.detailListId);

        //check if it is necessary grid
        if (!$.contains(detailList[0], gridObject.grid[0])) {
            return;
        }
        
        var userName = gridObject.grid.find('#' + rowId).find("[aria-describedby*='User Name']").text();
        $('[name=' + this.selectedRecipientHiddenInput + ']').val(userName);
    }
};

(function ($) {
    var prototype = $.sc.grid.prototype;
    $.widget("sc.grid", $.extend({}, prototype, {
        beforeSelectRow: function (rowId, e) {
            
            recipientsDetailList.updateHiddenUserNameField(this, rowId);

            prototype.beforeSelectRow.apply(this, arguments);
            return true;
        }
    }));
})(jQuery);
