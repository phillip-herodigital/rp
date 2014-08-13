<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ForgotPassword.ascx.cs"
    Inherits="Sitecore.Speak.WebSite.layouts.Speak.Sublayouts.ForgotPassword" %>
<asp:PasswordRecovery ID="PasswordRecovery" runat="server" Width="100%" UserNameFailureText='<%#DataItem["User Name wrong"] %>' OnVerifyingUser="OnVerifyingUser"
    OnSendingMail="OnSendEmail">
    <UserNameTemplate>
        <div class="item-title">
            <div class="field">
                <div class="editor">
                    <%#DataItem["title"] %>
                </div>
            </div>
        </div>
        <div class="field-editor">
            <fieldset>
                <div class="field">
                    <asp:Label runat="server" CssClass="title" AssociatedControlID="UserName" Text='<%#DataItem["User Name"] + ":" %>' />
                    <div class="editor">
                        <asp:TextBox ID="UserName" runat="server" />
                        <asp:RequiredFieldValidator Display="Dynamic" runat="server" EnableClientScript="false" ControlToValidate="UserName" ErrorMessage='<%#DataItem["User Name required"] %>' />
                        <asp:Label runat="server" Style="color: red" ID="FailureText" />
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="login-toolbar-holder">
            <div class="login-toolbar">
                <asp:Button ID="SubmitButton" runat="server" Text='<%#DataItem["Send button"] %>' CommandName="Submit" UpdateControls="PasswordRecovery" />
                <asp:Button ID="CancelButton" runat="server" CausesValidation="False" OnClick="OnCancelButtonClick" Text='<%#DataItem["Cancel button"] %>' />
            </div>
        </div>
    </UserNameTemplate>
    <MailDefinition Priority="High" From="someone@example.com" />
</asp:PasswordRecovery>