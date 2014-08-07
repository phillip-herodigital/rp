var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 3) {
    console.log('Usage: rasterize.js URL output');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    var jsonData = system.stdin.readLine();


    page.viewportSize = { width: 1024, height: 600 };
    page.paperSize = {
        format: 'Letter',
        orientation: 'portrait',
        border: '0.5in'
    };
    page.open(address, function (status) {
        page.evaluate(function (s) {
            deferred(angular.fromJson(s));
        }, jsonData)
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 200);
        }
    });
}
