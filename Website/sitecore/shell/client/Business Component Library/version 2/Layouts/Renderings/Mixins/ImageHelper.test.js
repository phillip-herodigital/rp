(function (Speak) {

  require.config({
    paths: {
      imageHelper: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/imageHelper"
    }
  });

  define(["imageHelper"], function (ImageHelper) {
    describe("Given a ImageHelper", function () {
      var sitecoreMediaString = '<image mediaid="{00000000-1111-2222-3333-444444444444}" alt="foo" height="1" width="2" hspace="3" vspace="4" />';

      describe("#getParameters(str)", function () {
        it("should return undefined if no string was given", function () {
          // act
          var parameters = ImageHelper.getParameters();

          // assert
          expect(parameters).toBeUndefined();
        });

        it("should return an object with a property for each attribute of given Sitecore media string", function () {
          // act
          var parameters = ImageHelper.getParameters(sitecoreMediaString);

          // assert
          expect(Object.keys(parameters).length).toBe(6);
        });
      });

      describe("#getUrl(str, database)", function () {
        it("should return undefined if no string was given", function () {
          // act
          var url = ImageHelper.getUrl();

          // assert
          expect(url).toBeUndefined();
        });

        it("should return undefined if no database was given", function () {
          // act
          var url = ImageHelper.getUrl("foo");

          // assert
          expect(url).toBeUndefined();
        });

        it("should return a string with the absolute url of the Sitecore media", function () {
          // prepares
          var database = "master";

          // act
          var url = ImageHelper.getUrl(sitecoreMediaString, database);

          // assert
          expect(url).toBe("/sitecore/shell/~/media/00000000111122223333444444444444.ashx?h=1&w=2&db=master");
        });
      });

      describe("#getValue(str, attribute)", function () {
        it("should return undefined if no string was given", function () {
          // act
          var mediaId = ImageHelper.getValue();

          // assert
          expect(mediaId).toBeUndefined();
        });

        it("should return undefined if no attribute was given", function () {
          // act
          var url = ImageHelper.getValue("foo");

          // assert
          expect(url).toBeUndefined();
        });

        it("should return the media id of the given Sitecore media", function () {
          // act
          var mediaId = ImageHelper.getValue(sitecoreMediaString, "alt");

          // assert
          expect(mediaId).toBe("foo");
        });
      });

      describe("#getId(str)", function () {
        it("should return the media id of the given Sitecore media", function () {
          // act
          var mediaId = ImageHelper.getId(sitecoreMediaString);

          // assert
          expect(mediaId).toBe("{00000000-1111-2222-3333-444444444444}");
        });
      });

      describe("#getAlt(str)", function () {
        it("should return the media id of the given Sitecore media", function () {
          // act
          var mediaId = ImageHelper.getAlt(sitecoreMediaString);

          // assert
          expect(mediaId).toBe("foo");
        });
      });

      describe("#getHeight(str)", function () {
        it("should return the media id of the given Sitecore media", function () {
          // act
          var mediaId = ImageHelper.getHeight(sitecoreMediaString);

          // assert
          expect(mediaId).toBe("1");
        });
      });

      describe("#getWidth(str)", function () {
        it("should return the media id of the given Sitecore media", function () {
          // act
          var mediaId = ImageHelper.getWidth(sitecoreMediaString);

          // assert
          expect(mediaId).toBe("2");
        });
      });

    });
  });
})(Sitecore.Speak);

