<%@ Control Language="c#" AutoEventWireup="true" Inherits="Sitecore.Modules.EmailCampaign.Layouts.SubscriptionForm"
    CodeBehind="Subscription Form.ascx.cs" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<div id="subscriptionForm" class="subscriptionPanel">
    <table id="subscriptionArea" class="subscriptionArea" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <div id="ListsArea" class="area" runat="server">
                    <fieldset>
                        <legend id="ListsHeader" runat="server">Lists</legend>
                        <div id="SrcList" runat="server" />
                    </fieldset>
                </div>             
                <div id="EmailArea" class="area right" runat="server">
                    <asp:Label ID="EmailLabel" CssClass="commonLabel" Text="E-mail Address: " AssociatedControlID="Email"
                        runat="server" />
                    <asp:TextBox ID="Email" Visible="false" runat="server" />
                    <asp:ImageButton ID="SubscribeImg" CssClass="subscribeImageButton" ImageUrl="Applications/24x24/bullet_triangle_green.png"
                        OnClick="Subscribe_click" Visible="false" runat="server" />
                </div>
                <div id="warningArea" class="area">
                    <div ID="Warning" class="warningMessage" runat="server" />
                </div>
                <div id="btnArea" class="area right">
                    <asp:Button ID="Confirm" OnClick="Confirm_click" class="hiddenControl" runat="server" />
                    <asp:Button ID="SubscribeBtn" Text="Subscribe" CssClass="commonButton" OnClick="Subscribe_click"
                        runat="server" />
                </div>
            </td>
        </tr>
    </table>
</div>
