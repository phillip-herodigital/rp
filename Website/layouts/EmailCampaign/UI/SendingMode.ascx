<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="SendingMode.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.SendingMode" %>
<h2>
  <%= Model.Texts.SendingMode %></h2>
<asp:CheckBox ID="EmulationModeCheckBoxEnabled" runat="server" />
<div class="notify">
  <span><i>
    <%= Model.Texts.EmulationModeIsDispatchingTheMessageWithoutActuallySendingItToTheRecipients %>
  </i></span>
</div>