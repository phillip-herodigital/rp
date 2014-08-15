<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MultiLanguage.ascx.cs" Inherits="Sitecore.EmailCampaign.Presentation.UI.MultiLanguage" %>
<h2><%= Model.Texts.Title %></h2>
<asp:Panel runat="server" ID="PreferredLanguageCheckBoxContainer">
    <asp:CheckBox ID="PreferredLanguageCheckBox" runat="server" />   

    <div class="description">
        <span>
            <i>
                <%= Model.Texts.OptionDescription1 %>
                <br/>
                <%= Model.Texts.OptionDescription2 %>
                <br/>
                <asp:Label runat="server" ID = "DefaultLanguageLabel"/>
            </i>
        </span>
    </div>
</asp:Panel>