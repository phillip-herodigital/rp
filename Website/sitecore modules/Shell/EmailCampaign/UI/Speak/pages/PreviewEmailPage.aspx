<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PreviewEmailPage.aspx.cs"
  Inherits="Sitecore.Modules.EmailCampaign.UI.Pages.PreviewEmailPage" %>

<%@ Import Namespace="Sitecore.Web" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
  <link rel="stylesheet" type="text/css" href="/sitecore modules/shell/emailcampaign/ui/speak/css/EmailCampaignSpeak.css" />
  <link rel="stylesheet" type="text/css" media="screen" href="/sitecore/apps/css/style.css" />
  <script type="text/javascript">
    function CloseDialog(sender) {
      if (sender == null) {
        return;
      }

      var closeButton = $(sender);

      var form = closeButton.parents('form:last');
      if (form != null) {
        var overlay = form.parents('.sc-overlay').parent().remove();
      }
    }
  </script>
</head>
<body>
  <form id="PopupForm" runat="server" method="post">  
  <div class="popup-instance">
    <div class="ui-corner-all ui-widget-content ui-widget ui-dialog">
      <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">
        <div class="ui-dialog-title">
          <asp:Label runat="server" Text="title" ID="TitleText" class="ui-dialog-title" Style="font-size: 14pt;" />
          <div style="float: right; margin-right: 40px;">
            <asp:Button CssClass="sc-button" ID="PreviousButton" runat="server" OnClick="GetPreviousImage_Click" />
            <asp:Button CssClass="sc-button" ID="NextButton" runat="server" OnClick="GetNextImage_Click" />
          </div>
          <%--<asp:LinkButton ID="CloseButton" runat="server" OnClick="OnClose" CssClass="cancel close ui-dialog-titlebar-close ui-corner-all ui-icon ui-icon-closethick"> </asp:LinkButton>--%>
          <a id="CloseButton" class="cancel close ui-dialog-titlebar-close ui-corner-all ui-icon ui-icon-closethick" href="#" onclick="CloseDialog(this);"></a>
        </div>
      </div>
      <div class="ui-dialog-content ui-widget-content">
        <div class="ui-dialog-main-content" style="height: auto; overflow: auto;">
          <div class="sc-scrollbox" style="text-align: center;">
            <asp:Image ID="PreviewImage" runat="server" ImageUrl="" />
          </div>
        </div>
      </div>
    </div>
  </div>
  </form>
</body>
</html>
