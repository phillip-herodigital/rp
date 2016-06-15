( function ( _sc ) {
    require.config( {
        paths: {
            mockjax: "/sitecore/shell/client/Business Component Library/version 2/Test/vendors/jquery.mockjax"
        }
    } );

    define(["mockjax"], function () {
        describe( "Given a AccountInformation component", function () {
            var sut = _sc.app.AccountInformation,
                $sutEl = $( sut.el );

            it( "component should exist", function () {
                expect( sut ).toBeDefined();
            } );
            it( "component EL should exist", function () {
                expect( $sutEl ).toBeDefined();
            } );
            it( "component should have a IsVisible property", function () {
                expect( sut.IsVisible ).toBeDefined();
            } );
            it( "component should have a logout method", function () {
                expect( sut.logout ).toBeDefined();
            } );
            describe( "when I set the property IsVisible to false", function () {
                it( "component should not be visible", function () {
                    sut.IsVisible = false;
                    expect( $sutEl.css( "display" ) ).toEqual( "none" );
                } );
            } );
            describe( "when I mock the Logout EndPoint", function () {
                var spy = jasmine.createSpy();

                beforeEach( function () {
                    window.location.hash = "";
                    $.mockjax.clear();
                } );

                afterEach( function () {
                    $.mockjax.clear();
                } );

                it( "it should log me out when I execute 'logout'", function (done) {
                    var event = {
                        currentTarget: sut.el.querySelector( ".logout" ),
                        preventDefault: function () { }
                    },
                      testUrl = window.location.href.replace( "#", "" ) + "#test";

                    $.mockjax( {
                        url: "/api/sitecore/Authentication/*",
                        type: "POST",
                        response: function () {
                            this.responseText = JSON.stringify( { Redirect: testUrl } );
                            spy();
                        }
                    } );

                    sut.logout( event, function () {
                        expect( spy ).toHaveBeenCalled();
                        done();
                    } );
                } );
            } );
        } );
    });

})(Sitecore.Speak);