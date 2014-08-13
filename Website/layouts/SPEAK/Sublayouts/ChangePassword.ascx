<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ChangePassword.ascx.cs" Inherits="Sitecore.Speak.WebSite.layouts.Speak.Sublayouts.ChangePassword" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>
<asp:ChangePassword ID="ChangePasswordControl" runat="server" Width="100%" DisplayUserName="true" ChangePasswordFailureText='<%#DataItem["Old password wrong"] %>' OnChangingPassword="OnChangingPassword" OnChangedPassword="OnChangedPassword" OnChangePasswordError="OnChangePasswordError" OnCancelButtonClick="OnReturnToDefault" OnContinueButtonClick="OnReturnToDefault">
                        <ChangePasswordTemplate>
                            <div class="item-title">
                                <div class="field">
                                    <div class="editor">
                                        <%#DataItem["title"]%>
                                    </div>
                                </div>
                            </div>
                            <div class="field-editor">
                                <fieldset>
                                    <div class="field">
                                        <asp:Label ID="lblUserName" runat="server" AssociatedControlID="UserName" CssClass="title" Text='<%#DataItem["User name"] + ":" %>' />
                                        <div class="editor">
                                            <asp:TextBox ID="UserName" runat="server" />
                                            <asp:RequiredFieldValidator runat="server" Display="Dynamic" EnableClientScript="false" ControlToValidate="UserName" ErrorMessage='<%#DataItem["User name required"]%>' />
                                            <asp:CustomValidator runat="server" Display="Dynamic" EnableClientScript="false" ControlToValidate="UserName" ErrorMessage='<%#DataItem["User name wrong"]  %>' OnServerValidate="UserNameValidate" />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <asp:Label ID="lblCurrentPassword" runat="server" CssClass="title" AssociatedControlID="CurrentPassword" Text='<%#DataItem["Old password"] + ":" %>' />
                                        <div class="editor">
                                            <asp:TextBox ID="CurrentPassword" runat="server" CssClass="field-value" TextMode="Password" />
                                            <asp:RequiredFieldValidator runat="server" Display="Dynamic" EnableClientScript="false" ControlToValidate="CurrentPassword" ErrorMessage='<%#DataItem["Old password required"]%>' />
                                            <asp:Label runat="server" Style="color: red" ID="FailureText" Visible="False" />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <asp:Label ID="lblNewPassword" runat="server" CssClass="title" AssociatedControlID="NewPassword" Text='<%#DataItem["New password"] + ":" %>' />
                                        <div class="editor">
                                            <asp:TextBox ID="NewPassword" runat="server" CssClass="field-value" TextMode="Password" />
                                            <asp:RequiredFieldValidator runat="server" Display="Dynamic" EnableClientScript="false" ControlToValidate="NewPassword" ErrorMessage='<%#DataItem["New password required"]%>' />
                                        </div>
                                    </div>
                                    <div class="field">
                                        <asp:Label ID="lblConfirmNewPassword" runat="server" CssClass="title" AssociatedControlID="ConfirmNewPassword" Text='<%#DataItem["Confirm password"] + ":" %>' />
                                        <div class="editor">
                                            <asp:TextBox ID="ConfirmNewPassword" runat="server" CssClass="field-value" TextMode="Password" />
                                            <asp:RequiredFieldValidator runat="server" Display="Dynamic" EnableClientScript="false" ControlToValidate="ConfirmNewPassword" ErrorMessage='<%#DataItem["Confirmation required"]%>' />
                                            <asp:CompareValidator runat="server" Display="Dynamic" ControlToValidate="NewPassword" EnableClientScript="False" ControlToCompare="ConfirmNewPassword" ErrorMessage='<%#DataItem["Password do not match"]%>'></asp:CompareValidator>
                                            
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="login-toolbar-holder" id="Div1">
                                <div class="login-toolbar">
                                    <asp:Button ID="ChangePasswordPushButton" runat="server" CommandName="ChangePassword" Text='<%#DataItem["Ok button"] %>' UpdateControls="ChangePassword" />
                                    <asp:Button ID="CancelPushButton" runat="server" CausesValidation="False" CommandName="Cancel" Text='<%#DataItem["Cancel button"] %>' UpdateControls="ChangePassword" />
                                </div>
                            </div>
                            </div>
                        </ChangePasswordTemplate>
                        <SuccessTemplate>
                            <div class="item-title">
                                <div class="field">
                                    <div class="editor">
                                        <%#DataItem["title"]%>
                                    </div>
                                </div>
                            </div>
                            <div class="field-editor">
                                <%#DataItem["Successfully changed"]%>
                            </div>
                            <div class="login-toolbar">
                                <asp:Button ID="ContinuePushButton" runat="server" CommandName="Continue" Text='<%#DataItem["Continue button"] %>' UpdateControls="ChangePassword" />
                            </div>
                        </SuccessTemplate>
                    </asp:ChangePassword>