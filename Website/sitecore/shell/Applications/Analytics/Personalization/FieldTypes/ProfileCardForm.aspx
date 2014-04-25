<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ProfileCardForm.aspx.cs"
  Inherits="Sitecore.Shell.Applications.Analytics.Personalization.ProfileCardForm" %>

<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<%@ Register Assembly="Sitecore.Client" Namespace="Sitecore.Shell.Applications.Analytics.Personalization"
  TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Profile Card Values</title>
  <script type="text/javascript" src="/sitecore/shell/Controls/lib/prototype/prototype.js"></script>
  <script type="text/javascript">
    function SetModified() {
      if (window.parent == null) {
        return;
      }

      var parentForm = window.parent.scForm;
      if (parentForm == null) {
        return;
      }

      parentForm.setModified(true);
    }
  </script>
  <link rel="stylesheet" href="/sitecore/shell/themes/standard/default/Default.css"/>
  <style>
    .profileKeyName
    {
      width:180px;  
    }

    .RadarChart{
      width:250px;
      height:170px;
      margin:10px;
      padding:0;
    }
  </style>
</head>
<body>
  <form id="ProfileCard" runat="server">
  <telerik:RadScriptManager runat="server" ID="ScriptManager" />
  <table cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="width: 320px;">
        <div runat="server" style="width: 100%; height: 190px; border: 0; overflow-y: auto;" id="ProfileKeyContainer">
        </div>
      </td>
      <td align="left" valign="top" style="padding:5px 10px 5px 10px; height:185px;">
        <div id="ChartContainer" runat="server" style="width: 280px; height: 100%; border: 1px solid #d4d4d4;background-color: White;">
          <sc:RadarChart runat="server" ID="Chart" CssClass="RadarChart" />
        </div>
      </td>
    </tr>
  </table>
  </form>
</body>
</html>
