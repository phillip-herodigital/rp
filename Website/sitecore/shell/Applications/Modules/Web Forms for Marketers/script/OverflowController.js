/************************************************
*            OverflowController
*
************************************************/
function OverflowController() {
    this.max = 150;
}

OverflowController._instance = null;

OverflowController.getInstance = function () {
    if (OverflowController._instance == null) {
        OverflowController._instance = new OverflowController();
    }
    return OverflowController._instance;
}

OverflowController.prototype.Init = function (frameID) {
    var self = this;

    setTimeout(function () {
        self.Update(frameID);
    }, 1000);

    this.Update(frameID);
}

OverflowController.prototype.Update = function (frameID) {

    var frame = $j("#" + frameID)[0];

    try {
        innerDoc = (frame.contentDocument) ? frame.contentDocument : frame.contentWindow.document;
        if (innerDoc.body.childNodes.length == 0) {
            frame.style.height = 0;
            return
        } else {
            if (IsIE()) {
                if (innerDoc.body.scrollHeight > this.max) {
                    frame.style.height = this.max + "px";
                    innerDoc.body.style.overflowY = 'auto';
                } else {
                    frame.style.height = innerDoc.body.scrollHeight + "px";
                }
            } else {

                var height = $j(innerDoc.body).find('span').height();

                if (height >= 56) {
                    frame.style.height = 60 + "px";
                    innerDoc.body.style.overflowY = 'auto';
                }
            }
        }
    }
    catch (err) {
        window.status = err.message;
    }
}