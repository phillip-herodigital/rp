<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SentMessageFunnel.ascx.cs" Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.SentMessageFunnel" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>
<div id="FunnelContainer" runat="server" class="sc-ecm-funnelContainer">
  <div id="sc-ecm-funnel">
    <div><asp:Label style="margin-left: 182px;" ID="TotalRecipients" CssClass="sc-ecm-funnelLabelText" runat="server"/></div>
    <div><asp:Label style="margin-left: 170px;" ID="ActualRecipients" CssClass="sc-ecm-funnelLabelText" runat="server"/></div>
    <div><asp:Label style="margin-left: 160px;" ID="Opened" CssClass="sc-ecm-funnelLabelText" runat="server"/></div>
    <div><asp:Label style="margin-left: 150px;" ID="Clicked" CssClass="sc-ecm-funnelLabelText" runat="server"/></div>
    <div><asp:Label style="margin-left: 140px;" ID="Browsed" CssClass="sc-ecm-funnelLabelText" runat="server"/></div>
    <div><asp:Label style="margin-left: 128px;" ID="Productive" CssClass="sc-ecm-funnelLabelText" runat="server"/></div>
  </div>
  <div id="sc-ecm-funnelSeparator"></div>

  <div id="sc-scm-funnelFooter">
    <table cellpadding="4" width="400">
    <tr>
      <td><asp:Label ID="ValueLabel" CssClass="sc-ecm-funnelLabelText" runat="server"/></td>
      <td class="sc-ecm-funnelLabelValue"><asp:Label ID="Value" runat="server"/></td>
      <td width="100">&nbsp;</td>
      <td><asp:Label ID="ValuePerEmailLabel" CssClass="sc-ecm-funnelLabelText" runat="server"/></td>
      <td class="sc-ecm-funnelLabelValue"><asp:Label ID="ValuePerEmail" runat="server"/></td>
    </tr>
    <tr>
      <td><asp:Label ID="ValuePerVisitLabel" CssClass="sc-ecm-funnelLabelText" runat="server"/></td>
      <td class="sc-ecm-funnelLabelValue"><asp:Label ID="ValuePerVisit" runat="server"/></td>
      <td></td>
      <td><asp:Label ID="VisitsPerEmailLabel" CssClass="sc-ecm-funnelLabelText" runat="server"/></td>
      <td class="sc-ecm-funnelLabelValue"><asp:Label ID="VisitsPerEmail" runat="server"/></td>
    </tr>
    </table>
  </div>  
</div>