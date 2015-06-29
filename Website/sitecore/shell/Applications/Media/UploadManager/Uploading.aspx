<%@ Page Language="C#" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  
  <style type="text/css">
    body { background:#fff; font-family:Arial; font-size:12px;}
    #Progress { margin:75px 0px 16px 0px; }
  </style>
  
</head>
<body>
  <form id="form1" runat="server">
    <table id="Grid" border="0" cellpadding="4" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <div id="Progress">
            <sc:ThemedImage runat="server" Src="Images/sc-spinner32.gif" />
          </div>
          <div>
            <sc:Literal runat="server" Text="Uploading..."/>
          </div>
        </td>
      </tr>
    </table>
  </form>
</body>
</html>
