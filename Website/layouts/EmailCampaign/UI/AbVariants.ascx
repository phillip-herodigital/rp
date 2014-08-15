<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="AbVariants.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.AbVariants" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls" Assembly="Sitecore.EmailCampaign.App" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.EmailCampaign.Presentation.UI" Assembly="Sitecore.EmailCampaign.Presentation.UI" %>

<asp:Panel ID="AbVariantsPanel" runat="server">
    <h2>
        <%= Model.Texts.AbVariants %></h2>
    <div>
        <%= Model.Texts.SelectTheAbVariantsAndTestSizeToTest %></div>
    <sc:selectvariantgroup id="DispatchVariantsList" cssclass="select-variant-group"
        runat="server" />
    <asp:Panel runat="server" ID="TestSizePanel">
        <div style="clear: both;" class="ab-variant-selector">
            <span class="ab-variant-selector-title">
                <%= Model.Texts.SizeOfTheTest %></span><sc:PercentagePicker runat="server" id="TestSizeList" Width="70" SelectedValue="10" AllowEmpty="False" />
        </div>
    </asp:Panel>
</asp:Panel>
