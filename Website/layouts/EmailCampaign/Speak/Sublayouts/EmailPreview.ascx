<%@ Control Language="c#" AutoEventWireup="true" EnableViewState="false" CodeBehind="EmailPreview.ascx.cs" Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.EmailPreview" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Core" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.Core" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls" Assembly="Sitecore.EmailCampaign.App" %>

<asp:Panel ID="MainPanel" runat="server">
    <div class="review-top-panel">
        <asp:Panel ID="SpinnerPanel" Style="text-align: center; vertical-align: middle;" runat="server">
            <img src="/sitecore/apps/img/sc-spinner16.gif" height="16" width="16" />
        </asp:Panel>
        <div id="MessageContainer" runat="server" visible="False">
            <asp:Label runat="server" ID="MessageLabel"></asp:Label>
        </div>
        <div id="MessageVariantsContainer" runat="server">
            <sc:SelectVariantGroup ID="MessageVariants" CssClass="select-variant-group" runat="server" />
        </div>
        <asp:Panel ID="PreviewPanel" runat="server" CssClass="preview-panel">
            <div>
                <sc:AjaxButton runat="server" ID="RunTest" UseSubmitBehavior="False" Style="float: left;" CssClass="sc-button sc-button-important" />
                <div id="EmailClientsContainer" runat="server" style="float: right; margin-right: 5px;"></div>
                <div id="ReportListContainer" runat="server" style="float: right; margin-right: 5px;"></div>
            </div>
            <div class="selcted-variant">
                <span>
                    <%=EcmTexts.Localize(EcmSpeakTexts.PreviewVariants)%></span>
                <div style="display: inline;"></div>
            </div>
        </asp:Panel>
    </div>

    <sc:EmailPreviewResult ID="ReviewResult" runat="server" />
</asp:Panel>

