<%@ Page Language="C#" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  
  <style type="text/css">
    body { background:#e9e9e9 }
    td  { font:bold 8pt tahoma  }
    #Icon { margin:64px 0px 16px 0px }
    #Progress { margin:0px 0px 16px 0px; }
  </style>
  
</head>
<body>
  <form id="form1" runat="server">
    <table id="Grid" border="0" cellpadding="4" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <sc:ThemedImage id="Icon" runat="server" Height="48" Width="48" Src="Applications/32x32/Export1.png" />
          
          <div id="Progress">
            <sc:ThemedImage runat="server" Height="17" Src="Images/progress.gif" Width="94"/>
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
