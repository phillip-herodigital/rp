<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CreateNewUser.aspx.cs" Inherits="Sitecore.Shell.Applications.Security.CreateNewUser.CreateNewUser" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<!DOCTYPE html>
<html>
<head runat="server">
  <title>Sitecore</title>
  <sc:Stylesheet Src="Default.css" DeviceDependant="true" runat="server" />
  <script language="javascript" type="text/javascript">
    window.name="modal";

    function onClose() {
      var openEditor = document.getElementById('OpenUserEditor');

      if (openEditor && openEditor.checked) {
        var dialogReturnValue = 'user:' + document.getElementById('CreateUserWizard_CompleteStepContainer_UserNameHiddenField').value;
        window.returnValue = dialogReturnValue;
        window.top.returnValue = dialogReturnValue;
      }

      window.top.dialogClose();
    }

    function onCancel() {
      var answer = confirm(closeWarningText);
      if (answer) {
        window.top.dialogClose();
      }

      window.event.cancelBubble = true;
      return false;
    }
    
    function onValidationSummaryChange() {
      var flexie = window.Flexie;
      if (flexie) flexie.updateInstance();
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
    
    .scCreateNewUserContent {
      padding-top: 8px; 
      padding-bottom: 8px; 
      background: #ebebeb; 
      vertical-align: top; 
      position:absolute; 
      top: 41px; 
      bottom: 0; 
      width: 100%;
    }

    .scCreateNewUserValidatorContainer {
      width: 6px;
      white-space: nowrap;
      overflow: hidden;
    }

    .scWizardStepAndNavigationContainer {
      position:absolute; 
      bottom: 8px; 
      top: 0; 
      width: 100%; 
      padding-left: 8px; 
      padding-right: 8px;
      overflow: auto;
    }

    .scCreateNewUserFormRow, .scCreateNewUserFormRowWithSelect, .scCreateNewUserFormRowAutoHeight {
      position: relative;
      vertical-align: middle;
      height: 26px;
      min-height: 26px;
      line-height: 26px;
    }

    .scCreateNewUserFormRowWithSelect {
      height: auto;
      min-height: 80px;
    }

    .scCreateNewUserFormRowAutoHeight {
      height: auto;
      min-height: 0;
    }

    .scCreateNewUserFormDescriptionColumn {
      width: 96px;
      padding: 2px;
      display: inline-block;
      text-align: right;
      vertical-align: middle;
    }
    
    .scCreateNewUserFormContentColumn {
      display: inline-block;
      left: 96px;
      right: 10px;
      position: absolute;
      padding: 2px;
      vertical-align: middle;
      height: 100%;
    }
    
    .scCreateNewUserFormValidationColumn {
      display: inline-block;
      width: 10px;
      padding: 2px;
      white-space: nowrap;
      overflow: hidden;
      position: absolute;
      right: 0;
      vertical-align: middle;
    }

    .scCreateNewUserFormValidationSummaryColumn {
      padding: 2px 2px 2px 96px;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    .scBorderBox {
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  </style>
</head>
<body style="overflow:hidden">
  <form id="MainForm" runat="server" target="modal">
    <sc:AjaxScriptManager runat="server" />
    <sc:ContinuationManager runat="server" />
    <input type="hidden" id="RolesValue" runat="server" />
      <div style="border-bottom:#212424;height:40px">
        <sc:ThemedImage Src="People/32x32/user1_new.png" Width="32" Height="32" runat="server" Float="left" Margin="2px 4px 2px 4px"/>

        <b><sc:Literal Text="Create a New User" runat="server" /></b><br />
        <sc:Literal Text="Enter information about the user." runat="server" />

      </div>
    
      <div class="scHorizontalLine"></div>

      <div class="scCreateNewUserContent scBorderBox">
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
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName"><sc:Literal ID="litUserName" Text="User Name:" runat="server"/></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="UserName" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ToolTip="User Name is required." ErrorMessage="User Name is required." ValidationGroup="CreateUserWizard1" ControlToValidate="UserName" CssClass="scCreateNewUserValidator">*</asp:RequiredFieldValidator>
                      <asp:CustomValidator ID="DomainValidation" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="UserName" ToolTip="User name is not valid in the selected domain." ErrorMessage="User name is not valid in the selected domain." OnServerValidate="OnValidateUserNameInDomain">*</asp:CustomValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="DomainLabel" runat="server" AssociatedControlID="Domain"><sc:Literal ID="litDomain" Text="Domain:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:DropDownList ID="Domain" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:DropDownList>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="FullNameLabel" runat="server" AssociatedControlID="FullName"><sc:Literal ID="Literal1" Text="Full Name:" runat="server"/></asp:Label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="FullName" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <label for="Email"><sc:Literal ID="Literal2" Text="Email:" runat="server"/></label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="Email" Width="100%" runat="server" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ControlToValidate="Email" ErrorMessage="Email is required." ID="EmailRequired" runat="server" ValidationGroup="CreateUserWizard1" CssClass="scCreateNewUserValidator">*</asp:RequiredFieldValidator>
                      <asp:RegularExpressionValidator ControlToValidate="Email" ID="EmailValidity" runat="server" ValidationGroup="CreateUserWizard1" ValidationExpression="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$" CssClass="scCreateNewUserValidator">*</asp:RegularExpressionValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="DescriptionLabel" runat="server" AssociatedControlID="Description"><sc:Literal ID="Literal3" Text="Comment:" runat="server"/></asp:Label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="Description" runat="server" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password"><sc:Literal ID="Literal4" Text="Password:" runat="server"/></asp:Label></td>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="Password" runat="server" TextMode="Password" Width="100%" autocomplete="off" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="Password" CssClass="scCreateNewUserValidator">*</asp:RequiredFieldValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRow">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="ConfirmPasswordLabel" runat="server" AssociatedControlID="ConfirmPassword"><sc:Literal ID="Literal5" Text="Confirm Password:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:TextBox ID="ConfirmPassword" runat="server" TextMode="Password" Width="100%" CssClass="scIgnoreModified"></asp:TextBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="ConfirmPasswordRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="ConfirmPassword" CssClass="scCreateNewUserValidator">*</asp:RequiredFieldValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRowWithSelect scFlexContent">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="RolesLabel" runat="server" AssociatedControlID="Roles"><sc:Literal ID="Literal6" Text="Roles:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td height="100%" width="100%" valign="top">
                              <select ID="Roles" runat="server" style="height:100%;width:100%" Size="4" class="scIgnoreModified"></select>
                            </td>
                            <td style="padding:0px 0px 0px 4px; vertical-align: top">
                              <asp:Button ID="AddRoles" Font-Names="tahoma" Font-Size="8pt" Width="56px" Height="25px" OnClientClick="javascript:return scForm.postRequest('','','','AddRoles_Click')" runat="server" />
                            </td>
                          </tr>
                        </table>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox"></div>
                  </div>
                  <div class="scCreateNewUserFormRowWithSelect scFlexContent">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox">
                      <asp:Label ID="ProfileLabel" runat="server" AssociatedControlID="Profile"><sc:Literal ID="Literal7" Text="User Profile:" runat="server" /></asp:Label>
                    </div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox">
                      <asp:ListBox ID="Profile" runat="server" Width="100%" Height="100%" CssClass="scIgnoreModified"></asp:ListBox>
                    </div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:RequiredFieldValidator ID="ListboxRequired" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="Profile" CssClass="scCreateNewUserValidator">*</asp:RequiredFieldValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRowAutoHeight" style="height: 4px">
                    <div class="scCreateNewUserFormDescriptionColumn scBorderBox"></div>
                    <div class="scCreateNewUserFormContentColumn scBorderBox"></div>
                    <div class="scCreateNewUserFormValidationColumn scBorderBox">
                      <asp:CompareValidator ID="PasswordCompare" runat="server" ValidationGroup="CreateUserWizard1" ControlToValidate="ConfirmPassword" ControlToCompare="Password" Display="None"></asp:CompareValidator>
                    </div>
                  </div>
                  <div class="scCreateNewUserFormRowAutoHeight">
                    <div class="scCreateNewUserFormValidationSummaryColumn scBorderBox" style="color: red; text-align: left" onresize="onValidationSummaryChange();">
                      <asp:Literal ID="AdditionalErrors" runat="server" EnableViewState="False"></asp:Literal>
                      <asp:ValidationSummary ID="ValidationSummary1" ValidationGroup="CreateUserWizard1" runat="server" DisplayMode="BulletList" />
                    </div>
                  </div>
                </ContentTemplate>
                <CustomNavigationTemplate>
                  <div style="padding:0px 10px 0px 0px" align="right">
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
                  <script type="text/javascript">
                    scForm.setModified(false);
                  </script>
                  <table height="100%" width="100%" border="0" style="padding-left: 8px; padding-right: 8px">
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
          
          <LayoutTemplate>
            <div style="display: none">
              <asp:PlaceHolder ID="headerPlaceHolder" runat="server" />
            </div>
            <div style="display: none">
              <asp:PlaceHolder ID="sideBarPlaceHolder" runat="server" />
            </div>

            <div class="scBorderBox scWizardStepAndNavigationContainer scFlexContent scFlexColumnContainer">
              <asp:PlaceHolder ID="WizardStepPlaceHolder" runat="server" />
              <div>
                <asp:PlaceHolder ID="navigationPlaceHolder" runat="server" />
              </div>
            </div>
          </LayoutTemplate>

        </asp:CreateUserWizard>

        <asp:Panel ID="ErrorPanel" runat="server" CssClass="scWarning" Visible="false">
          <sc:ThemedImage runat="server" Height="16" Width="16" style="vertical-align:middle; margin-right: 4px" Src="Applications/16x16/warning.png" />
          <sc:Literal Class="scWarningText" runat="server" Text="The default provider is configured to require question and answer. Set requiresQuestionAndAnswer='false' to use this wizard." />
        </asp:Panel>
      </div>
  </form>
</body>
</html>
