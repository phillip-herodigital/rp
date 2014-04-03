<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CreateNewUser.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.CreateNewUser.CreateNewUser" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Stylesheet Src="Default.css" DeviceDependant="true" runat="server" />
<script language="javascript" type="text/javascript">
    window.name="modal";

    function onClose() {
      var openEditor = document.getElementById('OpenUserEditor');

      if (openEditor && openEditor.checked) {
        window.returnValue = 'user:' + document.getElementById('CreateUserWizard_CompleteStepContainer_UserNameHiddenField').value;
      }
      window.close();
    }

    function onCancel() {
      var answer = confirm(closeWarningText);
      if (answer) {
        window.close();
      }

      window.event.cancelBubble = true;
      return false;
    }

  </script>

  <style type="text/css">
    ul { padding: 0 0 0 15px; margin: 0; }

    .scWarning {
      background: #ffffe4;
      border: 1px solid #c9c9c9;
      border-left:none;
      border-right:none;
      padding: 4px 2px 4px 4px;
      margin: 4px 0px 12px 0px;
      font-weight: bold;
      height: 40px;
    }

    .scWarning img {
      float: left;
    }

    .scWarningText {
      float: left;
      margin-left: 4px;
    }
  </style>
</head>
<body style="overflow:hidden">
  <form id="MainForm" runat="server" target="modal">
    <sc:AjaxScriptManager runat="server" />
    <sc:ContinuationManager runat="server" />
    <input type="hidden" id="RolesValue" runat="server" />

    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-bottom:#212424;height:40px">
          <sc:ThemedImage Src="People/32x32/user1_new.png" Width="32" Height="32" runat="server" Float="left" Margin="2px 4px 2px 4px"/>

          <b><sc:Literal Text="Create a New User" runat="server" /></b><br />
          <sc:Literal Text="Enter information about the user." runat="server" />

        </td>
      </tr>
      <tr>
        <td>
          <div style="background:#dbdbdb"><img src="/sitecore/images/blank.gif" width="1" height="1" alt="" border="0" /></div>
        </td>
      </tr>
      <tr>
        <td height="100%" style="padding: 8px; background: #ebebeb; vertical-align: top" valign="top">
          <asp:CreateUserWizard ID="CreateUserWizard" runat="server"
            Font-Names="tahoma" RequireEmail="false" Height="100%"
            Width="100%" LoginCreatedUser="false"
            FinishDestinationPageUrl="javascript:onClose()"
            CreateUserButtonText="Create"
            CancelButtonText="Cancel"
            EmailRegularExpression="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"
            OnCreatingUser="CreateUserWizard_CreatingUser"
            OnCreatedUser="CreateUserWizard_CreatedUser" OnCreateUserError="CreateUserWizard_CreateUserError">
              <WizardSteps>
                <asp:CreateUserWizardStep ID="CreateUserWizardStep" runat="server">
                  <ContentTemplate>
                    <table style="font-size:8pt;font-family:tahoma" border="0" width="100%" height="100%" cellpadding="2" cellspacing="0">
                      <tr>
                        <td align="right" nowrap="nowrap" valign="baseline">
                          <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName"><sc:Literal ID="litUserName" Text="User Name:" runat="server"/></asp:Label></td>
                        <td Width="100%">
                          <asp:TextBox ID="UserName" runat="server" Width="100%"></asp:TextBox>
                        </td>
                        <td>
                          <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ToolTip="User Name is required." ErrorMessage="User Name is required." ValidationGroup="CreateUserWizard1" ControlToValidate="UserName">
                                        *</asp:RequiredFieldValidator>
                          <asp:CustomValidator ID="DomainValidation" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="UserName" ToolTip="User name is not valid in the selected domain." ErrorMessage="User name is not valid in the selected domain." OnServerValidate="OnValidateUserNameInDomain">*</asp:CustomValidator>
                        </td>
                      </tr>

                      <tr>
                        <td align="right">
                          <asp:Label ID="DomainLabel" runat="server" AssociatedControlID="Domain"><sc:Literal ID="litDomain" Text="Domain:" runat="server" /></asp:Label>
                        </td>
                        <td>
                          <asp:DropDownList ID="Domain" runat="server" Width="100%"></asp:DropDownList>
                        </td>
                        <td>
                        </td>
                        <td></td>
                      </tr>

                      <tr>
                        <td align="right" nowrap="nowrap" valign="baseline">
                          <asp:Label ID="FullNameLabel" runat="server" AssociatedControlID="FullName"><sc:Literal Text="Full Name:" runat="server"/></asp:Label></td>
                        <td>
                          <asp:TextBox ID="FullName" runat="server" Width="100%"></asp:TextBox>
                        </td>
                        <td>
                        </td>
                      </tr>

                      <tr>
                        <td align="right" align="right" nowrap="nowrap" valign="baseline">
                          <label for="Email"><sc:Literal Text="Email:" runat="server"/></label></td>
                        <td>
                          <asp:TextBox ID="Email" Width="100%" runat="server"></asp:TextBox>
                        </td>
                        <td>
                          <asp:RequiredFieldValidator ControlToValidate="Email" ErrorMessage="Email is required."
                            ID="EmailRequired" runat="server" ValidationGroup="CreateUserWizard1">*</asp:RequiredFieldValidator>
                          <asp:RegularExpressionValidator ControlToValidate="Email" ID="EmailValidity" runat="server" ValidationGroup="CreateUserWizard1" ValidationExpression="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$">*</asp:RegularExpressionValidator>
                        </td>
                      </tr>
                      <tr>
                        <td align="right" nowrap="nowrap" valign="baseline">
                          <asp:Label ID="DescriptionLabel" runat="server" AssociatedControlID="Description"><sc:Literal Text="Comment:" runat="server"/></asp:Label></td>
                        <td>
                          <asp:TextBox ID="Description" runat="server" Width="100%"></asp:TextBox>
                        </td>
                        <td>
                        </td>
                      </tr>

                      <tr>
                        <td align="right" nowrap="nowrap" valign="baseline">
                          <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password"><sc:Literal Text="Password:" runat="server"/></asp:Label></td>
                        <td>
                          <asp:TextBox ID="Password" runat="server" TextMode="Password" Width="100%"></asp:TextBox>
                        </td>
                        <td>
                          <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="Password">
                                        *</asp:RequiredFieldValidator>
                        </td>
                      </tr>
                      <tr>
                        <td align="right" nowrap="nowrap" valign="baseline">
                          <asp:Label ID="ConfirmPasswordLabel" runat="server" AssociatedControlID="ConfirmPassword"><sc:Literal Text="Confirm Password:" runat="server" /></asp:Label>
                        </td>
                        <td>
                          <asp:TextBox ID="ConfirmPassword" runat="server" TextMode="Password" Width="100%"></asp:TextBox>
                        </td>
                        <td>
                          <asp:RequiredFieldValidator ID="ConfirmPasswordRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="ConfirmPassword">
                                        *</asp:RequiredFieldValidator>
                        </td>
                      </tr>

                      <tr>
                        <td align="right" valign="top" height="50%">
                          <asp:Label ID="RolesLabel" runat="server" AssociatedControlID="Roles"><sc:Literal Text="Roles:" runat="server" /></asp:Label>
                        </td>
                        <td>
                          <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td height="100%" width="100%" valign="top">
                                <select ID="Roles" runat="server" style="height:100%;width:100%" Size="8"></select>
                              </td>
                              <td valign="top" style="padding:0px 0px 0px 4px">
                                <asp:Button ID="AddRoles" Font-Names="tahoma" Font-Size="8pt" Width="56px" Height="25px" OnClientClick="javascript:return scForm.postRequest('','','','AddRoles_Click')" runat="server" />
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td>
                        </td>
                      </tr>

                      <tr>
                        <td align="right" valign="top" height="50%">
                          <asp:Label ID="ProfileLabel" runat="server" AssociatedControlID="Profile"><sc:Literal Text="User Profile:" runat="server" /></asp:Label>
                        </td>
                        <td>
                          <asp:ListBox ID="Profile" runat="server" Width="100%" Height="100%"></asp:ListBox>
                        </td>
                        <td>
                          <asp:RequiredFieldValidator ID="ListboxRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="Profile">
                                        *</asp:RequiredFieldValidator>
                        </td>
                      </tr>

                      <tr>
                        <td align="center" colspan="2">
                          <asp:CompareValidator ID="PasswordCompare" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="ConfirmPassword" ControlToCompare="Password" Display="None">
                          </asp:CompareValidator>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style="color: red" align="left">
                          <asp:Literal ID="AdditionalErrors" runat="server" EnableViewState="False"></asp:Literal>
                          <asp:ValidationSummary ValidationGroup="CreateUserWizard1" runat="server" DisplayMode="BulletList" />
                        </td>
                      </tr>
                    </table>
                  </ContentTemplate>
                  <CustomNavigationTemplate>
                    <div style="padding:0px 16px 0px 0px" align="right">
                      <asp:Button
                        runat="server"
                        ID="btnMoveNext"
                        CommandArgument="MoveNext"
                        CommandName="MoveNext"
                        ValidationGroup="CreateUserWizard1"
                        Style="width: 75px; height: 25px; margin-right: 4px"
                        OnPreRender="MoveButton_PreRender"/>
                      <asp:Button
                        runat="server"
                        ID="btnCancel"
                        CommandName="Cancel"
                        Style="width: 75px; height: 25px"
                        OnClientClick="onCancel();"
                        OnPreRender="CancelButton_PreRender"/>
                    </div>
                  </CustomNavigationTemplate>
                </asp:CreateUserWizardStep>

                <asp:CompleteWizardStep ID="CompleteWizardStep" runat="server">
                  <ContentTemplate>
                    <table height="100%" width="100%" border="0">
                      <tr height="100%" valign="top">
                        <td>
                          <b>
                            <sc:Literal Text="The user has been successfully created." runat="server" />
			                      <asp:HiddenField runat="server" id="UserNameHiddenField" />
                          </b><br />

                          <sc:Space Height="16px" runat="server" />

                          <div style="margin-left: -4px">
                            <input type="checkbox" id="OpenUserEditor" />
			                      <label for="OpenUserEditor"><sc:Literal Text="Open the User Editor" runat="server" /></label>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <div style="padding:32px 0px 0px 0px" align="right">
                            <button onclick="javascript:onClose();" type="button" style="width:85px;height:25px"><sc:Literal Text="Finish" runat="server" /></button>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </ContentTemplate>
                </asp:CompleteWizardStep>
              </WizardSteps>

              <SideBarStyle BackColor="#5D7B9D" BorderWidth="0px" VerticalAlign="Top" />
              <SideBarButtonStyle BorderWidth="0px" Font-Names="Verdana" ForeColor="White" />
              <NavigationButtonStyle Font-Names="Tahoma" Font-Size="8pt" />
              <HeaderStyle BackColor="#5D7B9D" BorderStyle="Solid" Font-Bold="True" ForeColor="White" HorizontalAlign="Left" />
              <CreateUserButtonStyle Font-Names="Tahoma" Font-Size="8pt" Width="75" Height="21" />
              <CancelButtonStyle Font-Names="Tahoma" Font-Size="8pt" Width="75" Height="21" />
              <ContinueButtonStyle Font-Names="Tahoma" Font-Size="8pt" />
              <StepStyle BorderWidth="0px" />
              <TitleTextStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
              <LabelStyle Font-Size="9pt" Font-Names="verdana" />
              <TextBoxStyle Font-Bold="true" Font-Size="9pt" Font-Names="verdana" />

            </asp:CreateUserWizard>

            <asp:Panel ID="ErrorPanel" runat="server" CssClass="scWarning" Visible="false">
              <sc:ThemedImage runat="server" Height="16" Width="16" style="vertical-align:middle; margin-right: 4px" Src="Applications/16x16/warning.png" />
              <sc:Literal Class="scWarningText" runat="server" Text="The default provider is configured to require question and answer. Set requiresQuestionAndAnswer='false' to use this wizard." />
            </asp:Panel>
        </td>
      </tr>
    </table>
  </form>
</body>
</html>
