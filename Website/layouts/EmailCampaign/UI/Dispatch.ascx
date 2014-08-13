<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Dispatch.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.Dispatch" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.Core" %>
<%@ Register TagPrefix="sc" TagName="AbVariants" Src="AbVariants.ascx" %>
<%@ Register TagPrefix="sc" TagName="Delivery" Src="Delivery.ascx" %>
<%@ Register TagPrefix="sc" TagName="WinnerSelector" Src="WinnerSelector.ascx" %>
<%@ Register TagPrefix="sc" TagName="Notification" Src="Notification.ascx" %>
<%@ Register TagPrefix="sc" TagName="MultiLanguage" Src="MultiLanguage.ascx" %>
<%@ Register TagPrefix="sc" TagName="SendingMode" src="SendingMode.ascx" %>
<%@ Register TagPrefix="sc" TagName="CancelSchedulingButton" Src="CancelSchedulingButton.ascx" %>

<script type="text/javascript" src="<%= SpeakConstants.ScriptsRoot  %>jquery.form.js"></script>
<script type="text/javascript" src="<%= SpeakConstants.ScriptsRoot  %>sc.validate.extended.js"></script>

<asp:Panel runat="server" ID="DispatchControl">
  <asp:Panel ID="DispatchFields" CssClass="field-editor sc-ecm-dispatch" runat="server">
    <div class="field">
      <sc:AbVariants ID="AbVariantsUserControl" runat="server" />
    </div>
    <div class="field">
      <sc:Delivery ID="DeliveryUserControl" runat="server" />
    </div>
    <div class="field">
      <sc:WinnerSelector ID="WinnerSelector" runat="server" />
    </div>
    <div class="field">
      <sc:Notification ID="NotificationUserControl" runat="server" />
    </div>
    <div class="field">
      <sc:MultiLanguage ID="MultiLanguageUserControl" runat="server"/>
    </div>
    <div class="field" data-importance="3">
      <sc:SendingMode ID="SendingModeUserControl" runat="server" />
    </div>
  </asp:Panel>
  <div class="sc-ecm-dispatch" style="padding: 15px; clear: both">
      <div id="Buttons" runat="server" class="ui-dialog-buttonset">
         <sc:CancelSchedulingButton ID="CancelScedulingControl" name="CancelScedulingControl" runat="server" />
         <input runat="server" type="button" id="ActionButton" name="ActionButton" class="task-accept dispatch" />
      </div>
      <br style="clear: both" />
  </div>
</asp:Panel>
