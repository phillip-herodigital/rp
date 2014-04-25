MessagePreview = new function () {
    this.initialized = false;
    this.HtmlBodyID = "HtmlBody";
    this.LinksDisabled = true;

    this.MakeActive = function (target) {
        $("BtnText").className = "switchButton";
        $("BtnHtml").className = "switchButton";
        $(target).className = "switchButtonActive";
        $("ActiveModeButton").value = target;
    },
    this.Initialize = function () {
        if (this.initialized)
            return;

        this.initialized = true;

        setTimeout("MessagePreview.AddBody()", 5);
    },

    this.DisableFrameLinks = function () {
        var bodyFrame = $('BodyFrame');
        if (bodyFrame == null) return;

        var links = bodyFrame.contentWindow.document.links;
        if (links == null) return;

        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function () { return false; };
        }
    },

    this.AddBody = function () {
        var bodyFrame = $('BodyFrame');

        if (bodyFrame == null) {
            return;
        }

        var innerDoc = (bodyFrame.contentDocument) ? bodyFrame.contentDocument : bodyFrame.contentWindow.document;

        if (innerDoc.readyState != null) {
            if ((innerDoc.readyState == 'complete' || innerDoc.readyState == 'interactive')) {
            } else {
                setTimeout("MessagePreview.AddBody()", 1000);
                return;
            }
        }

        var htmlBody = $(this.HtmlBodyID);
        var bodyText = htmlBody.innerText;

        if (bodyText == undefined)
            bodyText = htmlBody.textContent;

        bodyFrame.contentWindow.document.close();
        bodyFrame.contentWindow.document.open();

        bodyFrame.contentWindow.document.write(bodyText);

        if (this.LinksDisabled)
            this.DisableFrameLinks();
    },

    this.InsertBodyByTimeout = function () {
        if (this.initialized)
            return;

        var bodyFrame = $('BodyFrame');
        if (bodyFrame == null)
            return;

        if ((bodyFrame.contentWindow.document.readyState == 'complete' || bodyFrame.contentWindow.document.readyState == 'interactive')) {
            this.AddBody();
        } else {
            setTimeout("MessagePreview.InsertBodyByTimeout()", 500);
        }
    };

    if (window.document.readyState != null) {
        setTimeout("MessagePreview.InsertBodyByTimeout()", 500);
    }
}