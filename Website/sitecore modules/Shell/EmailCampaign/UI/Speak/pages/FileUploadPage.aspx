<%@ Page Language="C#" AutoEventWireup="true" Inherits="Sitecore.Modules.EmailCampaign.Speak.UI.Pages.FileUploadPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Sitecore</title>
    <script type="text/javascript">
        {
            //TODO: this is a temporary workaround for the IE 9 & 10 bug - http://msdn.microsoft.com/en-us/library/gg622929%28v=VS.85%29.aspx?ppud=4
            //instead the code that updates the iframe or surrounding DOM elements is the one to update, see http://stackoverflow.com/a/5585018/66372 and http://stackoverflow.com/a/8686177/66372
            if (typeof (Object) === "undefined") {//http://stackoverflow.com/a/9915283/66372
                window.location.reload();
            }
        }
    </script>
    <script type="text/javascript" src="../../../../../shell/EmailCampaign/UI/speak/scripts/jquery.min.js"></script>
    <script type="text/javascript">
        function notifyUploaded(filepath, filename) {
            var parent = $.browser.webkit ? window.opener.parent : window.parent;
            parent.SendFileUploadRequest(filepath, filename);
            if ($.browser.webkit) {
                window.close();
            }
        }
        function uploadFile() {
            window.document.forms["UploadFileForm"].submit();
        }
        function StartUpload() {
            if ($.browser.webkit) {
                var url = "/sitecore modules/shell/EmailCampaign/UI/Speak/pages/FileUploadPage.aspx";
                var features = "dialogWidth:300;dialogHeight:100;help:no;scroll:auto;resizable:yes;center:yes;status:no";
                window.showModalDialog(url, "", features);
            } else {
                $('#FileInput').trigger('click');
            }
        }
        function TriggerError(errorMessage) {
            var parent = $.browser.webkit ? window.opener.parent : window.parent;
            if (parent.FileUploadError) {
                parent.FileUploadError(errorMessage);
            }
            
            if ($.browser.webkit) {
                window.close();
            }
        }
        $(function () {
           $('#' + '<%=this.FileInput.ClientID%>').bind('change', uploadFile); 
        });
    </script>
</head>
<body style="background: transparent;">
    <form id="UploadFileForm" runat="server" enctype="multipart/form-data">
    <input id="FileInput" type="file" runat="server" onchange="uploadFile(this)" />
    </form>
</body>
</html>
