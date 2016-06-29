( function ( speak ) {

    require.config( {
        paths: {
            collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
            multiselection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/MultiSelection"
        }
    } );

    speak.component( ["collection", "multiselection"], function ( Collection, MultiSelection ) {
        return speak.extend( {}, Collection.prototype, MultiSelection.prototype, {
            initialized: function () {
                Collection.prototype.initialized.call( this );
                MultiSelection.prototype.initialized.call(this);
            }
        } );
    }, "ListBox" );
} )( Sitecore.Speak );