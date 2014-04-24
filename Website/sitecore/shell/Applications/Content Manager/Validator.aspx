<%@ Page Language="C#" AutoEventWireup="true" Inherits="Sitecore.Shell.Applications.ContentManager.Validator" %>
<meta http-equiv="X-UA-Compatible" content="IE=9,10" />
<asp:Literal runat="server" ID="OutputLiteral"></asp:Literal>

<div id="baseuri" style="display: none;">
    <asp:Literal runat="server" ID="BaseUriLiteral"></asp:Literal>
</div>

<script type="text/javascript">
    var baseUriElement = document.getElementById('baseuri');
    if (baseUriElement && baseUriElement.innerHTML !== "") {
        var baseUri = baseUriElement.innerHTML;
        for (var i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].id == 'markup') continue;
            var images = document.body.children[i].getElementsByTagName('img');
            for (var j = 0; j < images.length; j++) {
                var image = images[j];
                if (image.attributes['src'].value.indexOf('http') !== 0) {
                    if (image.attributes['src'].value.indexOf('.') === 0) {
                        image.attributes['src'].value = baseUri + image.attributes['src'].value.replace('.', '');
                    }
                    else if (image.attributes['src'].value.indexOf('/') === 0) {
                        image.attributes['src'].value = baseUri + image.attributes['src'].value;
                    }
                    else {
                        image.attributes['src'].value = baseUri + '/' + image.attributes['src'].value;
                    }
                }
            }
        }  
    }

</script>