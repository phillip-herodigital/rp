<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="RecipientBehavior.ascx.cs"
  Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.RecipientBehavior" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>
<%@ Register Src="SentMessageFunnel.ascx" TagName="SentMessageFunnel" TagPrefix="sl" %>
<sc:accordion id="FunnelAccordion" runat="server" collapsed="false" enablecollapsing="true">
  <header title=""></header>
  <content> 
    <div style="background-color:White;">
      <sl:SentMessageFunnel runat="server" ID="Funnel"/><br />
      <div style="padding:10px; text-align:right;">
        <a id="OpenMonitorButton" href="Javascript:EcmOpenMonitor();"><asp:Label ID="OpenMonitorLabel" runat="server"/></a>
    </div>
    </div> 
  </content>
</sc:accordion>
