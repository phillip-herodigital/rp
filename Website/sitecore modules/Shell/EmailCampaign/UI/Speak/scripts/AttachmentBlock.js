var attachmentBlock = {

    subscribeOnSelectedEvents: function (detailListId, actionsControlId, removeCommandName) {
        $(document).ready(function () {
            var grid = $('#' + detailListId);
            var actionsControl = $('#' + actionsControlId);
            var remComNameAttr = actionsControl.find("[name *= '" + removeCommandName + "']").attr("name");
            var removeCommand = $("[name = '" + remComNameAttr + "']");

            //subscribe to different event
            grid.bind('DOMNodeInserted DOMNodeRemoved', function () {
                attachmentBlock.setRemoveAttachmentCommandVisiblity(grid, actionsControl, removeCommand);
            });
            $('#attachmentsCounter').click(function () {
                attachmentBlock.setRemoveAttachmentCommandVisiblity(grid, actionsControl, removeCommand);
            });
            $('#' + detailListId).on('onSelectAll', function (row, status) {
                attachmentBlock.setRemoveAttachmentCommandVisiblity(grid, actionsControl, removeCommand);
            });
            $('#' + detailListId).on('onSelectRow', function (row, status) {
                attachmentBlock.setRemoveAttachmentCommandVisiblity(grid, actionsControl, removeCommand);
            });
        });
    },

    setRemoveAttachmentCommandVisiblity: function (grid, actionsControl, removeCommand) {
        var speakMenu = actionsControl.data().speakmenu;
        var item = speakMenu.getItem(removeCommand);
        if (grid.find("[aria-selected='true']").length > 0) {
            //enable remove attachment
            item.state = 1;
            item.spinnerenabled = true;
            removeCommand.show();
            
            removeCommand.next("#nextToRemove").hide();
        } else {
            //disable remove attachment
            item.state = 2;
            item.spinnerenabled = false;

            removeCommand.hide();
            
            if (removeCommand.next("#nextToRemove").length == 0) {
                removeCommand.each(function (index, menuItem) {
                    $(menuItem).after("<a href=\"#\" id=\"nextToRemove\" class=\"menu-item menu-item-name last disabled\" onclick=\"event.stopPropagation();\">" + $(menuItem).html() + "</a>");
                });
            }
            removeCommand.next("#nextToRemove").show();
        }
    }
};