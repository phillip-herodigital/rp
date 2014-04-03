<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AddTab.aspx.cs" Inherits="Sitecore.Buckets.Module.AddTab" %>

<%@ Import Namespace="Sitecore" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="./Scripts/jquery.min.js" type="text/javascript"></script>
    <script src="./Scripts/jquery.min.noconflict.js" type="text/javascript"></script>
    <script src="/sitecore/shell/controls/lib/prototype/prototype.js" type="text/javascript"></script>

    <% if (UIUtil.IsIE())
       {%>
    <script src="/sitecore/shell/controls/InternetExplorer.js" type="text/javascript"></script>
    <% }
       else
       { %>
    <script src="/sitecore/shell/controls/Gecko.js" type="text/javascript"></script>
    <% } %>
    <script src="/sitecore/shell/controls/Sitecore.js" type="text/javascript"></script>
    <!--[if IE]>
     <link href="/sitecore/shell/Applications/Buckets/Styles/ItemBucket.ie.css" rel="stylesheet" type="text/css" />
    <![endif]-->

    <script type="text/javascript">


        $j(document).ready(function () {
            
            //if (!$j.browser.msie) {
                var firstLoad = true;

                $j(".scRibbonEditorTabNormal", parent.document.body).click(function() {

                    var src = $j('.scEditorTabHeaderActive', parent.document.body)[0].firstChild.src;
                    if (src.indexOf("Applications/16x16/view_add.png") != -1) {
                        window.scForm.getParentForm().postRequest('', '', '', 'contenteditor:launchblanktab(url=' + '' + ')');
                        firstLoad = false;
                    }


                });
            //}

        });

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
</body>
</html>
