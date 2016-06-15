describe( "Given a List page, when the List page does not show GlobalHeader", function () {
    it( "should hide the Global header and shoult add a Top Class", function () {
        expect( $( ".sc-globalHeader" ).length === 0 ).toBe( true );
        expect( $( ".sc-applicationContent" ).hasClass("top") ).toBe( true );
    } );
} );