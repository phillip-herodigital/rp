function PreventPeUnloadMessage(iframeId) {
    $('#' + iframeId).on('load', function () {
        (function DetachScBeforeUnloadRecursive(element) {
            $('iframe', element).each(function (index, iframe) {
                var contentWindow = iframe.contentWindow
                , scForm = contentWindow.scForm
                , beforeUnloadHandler = contentWindow.scBeforeUnload;

                if (scForm && beforeUnloadHandler) {
                    if (scForm.browser.isWebkit) {
                        scForm.browser.detachEvent(window.top, "onbeforeunload", beforeUnloadHandler);
                    }
                    else {
                        scForm.browser.detachEvent(contentWindow, "onbeforeunload", beforeUnloadHandler);
                    }
                }
                DetachScBeforeUnloadRecursive($(iframe).contents());
            });
        })($(this).contents());
    });
}

function messageBodyPopupEditModeBtnClick() {
    $('a#CloseButton').bind('click', function (e) {	
		var ribbon = $('#main_0_content').contents().find('#scWebEditRibbon');
        var editBtn = ribbon.contents().find('#RibbonPanel #RibbonPane #Ribbon #Ribbon_Toolbar').find('div.chunk:first').find('.panel').children('a:first');
        if (editBtn != "undefined") {
            if (!editBtn.hasClass('scRibbonToolbarLargeButtonDown')) {
                var isIE = window.scBrowser && $.browser.msie;
                if (isIE) { e.preventDefault(); }
                editBtn.click();
                if (isIE) { setTimeout(function () { __doPostBack('CloseButton', ''); }, 2000); }
            }
        }
        if ($.browser.mozilla) {
            var saveBtn = ribbon.contents().find('#Buttons').find('#scRibbonButton_Save');
            if (saveBtn.hasClass('scDisabledButton'))
            editBtn.click();
        }
    });
}