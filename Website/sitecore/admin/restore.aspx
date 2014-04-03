<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="restore.aspx.cs" Inherits="Sitecore.sitecore.admin.Restore" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Restore</title>
</head>
<body>
  <form id="form1" runat="server">
    <table>
      <tr>
        <td>
          Original database:
        </td>
        <td>
          <asp:TextBox ID="ctlDatabase" runat="server" Width="100" Text="master" />
        </td>
      </tr>
      <tr>
        <td>
          Archive name:
        </td>
        <td>
          <asp:TextBox ID="ctlArchive" runat="server" Width="100" Text="archive" />
        </td>
      </tr>
      <tr>
        <td>
          Path to archived item (in archive database):
        </td>
        <td>
          <asp:TextBox ID="ctlPath" runat="server" Width="500" />
        </td>
      </tr>
      <tr>
        <td>
        </td>
        <td>
                <asp:Button runat="server" ID="btnGo" Text="Restore" OnClick="ButtonGo_Click" />
        </td>
      </tr>
    </table>
  </form>
</body>
</html>