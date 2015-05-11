var devices = $$('div.scContentControlLayoutDeviceName');
for (var i = 0; i < devices.length; i++) {
    var device = devices[i];
    var literal = device.select("span");
    if (literal.length == 0) continue;
    var shortText = literal[0].readAttribute("title");
    var parentWidth = device.getLayout().get("width") + device.getLayout().get("padding-right");
    while (literal[0].getWidth() >= parentWidth ) {
        shortText = shortText.substring(0, shortText.length - 1);
        literal[0].update(shortText + "...");
    }
}
