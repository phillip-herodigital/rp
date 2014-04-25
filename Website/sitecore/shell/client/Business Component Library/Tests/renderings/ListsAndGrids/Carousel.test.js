require(["jasmineEnv", "/-/speak/v1/business/carousel.js"], function (jasmineEnv) {

    var setupTests = function () {
        "use strict";

        describe("Given a Carousel model", function () {
            var carousel = new Sitecore.Definitions.Models.Carousel();

            describe("when I create a Carousel model", function () {

                it("it should have a orientation property", function () {
                    expect(carousel.get("orientation")).toBeDefined();
                });

                it("it should have a tileWidth property", function () {
                    expect(carousel.get("tileWidth")).toBeDefined();
                });

                it("it should have a tileHeight property", function () {
                    expect(carousel.get("tileHeight")).toBeDefined();
                });

                it("it should have a tilePadding property", function () {
                    expect(carousel.get("tilePadding")).toBeDefined();
                });

                it("it should have a onlyEntireTiles property", function () {
                    expect(carousel.get("onlyEntireTiles")).toBeDefined();
                });
            });
        });

    };

    runTests(jasmineEnv, setupTests);
});