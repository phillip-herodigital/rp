<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Login.ascx.cs" Inherits="Sitecore.Speak.WebSite.layouts.Speak.Sublayouts.Login" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<%@ Import Namespace="Sitecore.Globalization" %>
<asp:Login ID="UserLogin" runat="server" TextLayout="TextOnTop" CssClass="login-form"
    OnLoginError="OnLoginError" OnLoggingIn="OnLoggingIn" OnLoggedIn="OnLoggedIn"
    FailureAction="Refresh" PasswordRequiredErrorMessage='<%#Sitecore.Context.Item["Password required"] %>'
    FailureText='<%#Sitecore.Context.Item["Password wrong"] %>' >
    <LayoutTemplate>
        <div class="item-title">
            <div class="field">
                <div class="editor">
                    <sc:Text Field="Log in button" runat="server" />
                </div>
            </div>
        </div>
        <div class="field-editor">
            <fieldset>
                <div class="field">
                    <asp:Label CssClass="title" runat="server" AssociatedControlID="UserName" Text='<%# Sitecore.Context.Item["User name"] + ":" %>' />
                    <div class="editor">
                        <asp:TextBox ID="UserName" runat="server" />
                        <asp:RequiredFieldValidator Display="Dynamic" Style="color: red" runat="server" EnableClientScript="false"
                            ControlToValidate="UserName" ErrorMessage='<%#Sitecore.Context.Item["User name required"]  %>' /></div>
                </div>
                <div class="field">
                    <asp:Label CssClass="title" runat="server" AssociatedControlID="Password" Text='<%# Sitecore.Context.Item["Password"] + ":"  %>' />
                    <div class="editor">
                        <asp:TextBox ID="Password" runat="server" TextMode="Password" />
                        <asp:RequiredFieldValidator Display="Dynamic" Style="color: red" runat="server" EnableClientScript="false"
                            ControlToValidate="Password" ErrorMessage='<%#Sitecore.Context.Item["Password required"]  %>' />
                        <asp:Label runat="server" Visible="false" Style="color: red" ID="FailureText" />
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="login-toolbar-holder">
            <div class="login-toolbar">
                <asp:Button ID="Login" CommandName="Login" runat="server" Text='<%#Sitecore.Context.Item["Log in button"] %>'
                    UpdateControls="UserLogin" />
            </div>
        </div>
        <div class="login-block-actions">
            <asp:CheckBox ID="RememberMe" runat="server" Text='<%#Sitecore.Context.Item["Remember me"] %>' />
            <span class="login-actions-separator"></span>
            <asp:HyperLink runat="server" ID="HyperLink1" NavigateUrl='<%# GetItemUrl(Sitecore.Context.Item.Fields["Forgot my password"]) %>' Text='<%#Translate.Text("Forgot Your Password") %>'></asp:HyperLink>
            <span class="login-actions-separator"></span>
            <asp:HyperLink runat="server" ID="HyperLink2" NavigateUrl='<%# GetItemUrl(Sitecore.Context.Item.Fields["Change my password"]) %>' Text='<%#Translate.Text("Change Password") %>'></asp:HyperLink>
        </div>
    </LayoutTemplate>
</asp:Login>
