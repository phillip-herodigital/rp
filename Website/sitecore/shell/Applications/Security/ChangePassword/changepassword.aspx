<%@ Page language="c#" AutoEventWireup="True" Inherits="Sitecore.Shell.Applications.Security.ChangePassword.ChangePasswordPage" CodeBehind="ChangePassword.aspx.cs" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html>
<head>
  <base target="_self" />
  <title>Sitecore</title>
  <link href="/sitecore/login/default.css" rel="stylesheet" />
  <style>
    html {
      background: white;
    }
    
    body {
      font: 8pt Tahoma;
    }
    
    #ChangePassword{
      margin: auto;
    }
    
    .titleText {
      display: none;
    }
    
    .scButton {
    	color: black;
	    width: 75px;
	    height: 24px;
	    font: 8pt Tahoma;
	    
	    margin-top: 28px;
    }
    
    .error .scButton {
      margin-top: 8px;
    }
    
    .changePassword {
      position: absolute;
      right: 90px;
      width: 120px !important;
    }
    
    .cancel {
      position: absolute;
      right: 8px;
    }
    
    .continue {
      position: absolute;
      right: 8px;
      top: 130px;
    }
    
    .label {
      padding-top: 1px;
      padding-right: 4px;
    }
    
    .textBox {
      width: 320px;
    }
  </style>
</head>
<body style="overflow:auto">
 <form id="LoginForm" runat="server">
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="border-bottom:#212424;height:40px">
          <sc:ThemedImage Src="Control/32x32/edit_mask.png" Width="32" Height="32" runat="server" Float="left" Margin="-2px 8px 4px 8px"/>
        
          <b style="margin-top: 4px; padding-top: 4px"><sc:Literal Text="Change Password" Style="font-size: 9pt" runat="server" /></b><br />
          <div style="padding-top: 4px">
            <sc:Literal style="color: #333333" Text="Enter your current and new password." runat="server" />
          </div>          
        </td>
      </tr>
      <tr>
        <td>
          <div class="scHorizontalLine">.</div>
        </td>
      </tr>
      <tr>
        <td height="100%" style="padding: 16px 8px 8px 8px; background: #ebebeb; vertical-align: top" valign="top">
        <asp:ChangePassword ID="ChangePassword" runat="server" 
          DisplayUserName="false" TitleTextStyle-CssClass="titleText"
          InstructionText="" Font-Names="tahoma" Font-Size="8pt">
          <CancelButtonStyle BackColor="#FFFBFF" BorderColor="#CCCCCC" BorderStyle="Solid" BorderWidth="1px" Font-Names="tahoma" ForeColor="#284775" />
          <ChangePasswordButtonStyle BackColor="#FFFBFF" BorderColor="#CCCCCC" BorderStyle="Solid" BorderWidth="1px" Font-Names="tahoma" ForeColor="#284775" />
          <ContinueButtonStyle CssClass="scButton continue" />
          <CancelButtonStyle CssClass="scButton cancel" />
          <ChangePasswordButtonStyle CssClass="scButton changePassword" Width="120px" />
          <TitleTextStyle Font-Bold="True" ForeColor="black" />
          <PasswordHintStyle Font-Italic="True" ForeColor="#888888" />
          <InstructionTextStyle ForeColor="Black" Font-Size="8pt" Font-Names="tahoma"  />
          <LabelStyle Font-Size="8pt" Font-Names="tahoma" HorizontalAlign="Left" CssClass="label" />
          <TextBoxStyle CssClass="textBox" />
          <TextBoxStyle Font-Bold="true" Font-Size="8pt" Font-Names="tahoma" />
          <ValidatorTextStyle CssClass="validationErrors" />
          <FailureTextStyle CssClass="failure" />
        </asp:ChangePassword>
        </td>
      </tr>
    </table>
  </form>
  <script type="text/javascript">
    $$(".scButton").each(function(button) {
      button.setAttribute("style", "");
      button.removeAttribute("style");
    });
    
    
    Event.observe(window, "load", function() { setTimeout(update, 500); });
    if ($$(".changePassword").length > 0) {
      $$(".changePassword")[0].observe("click", function() { setTimeout(update, 500); });
    }
    
    function update() {
      $$(".validationErrors").each(function(error) {
        if (error.style.visibility == "hidden" || error.style.display == "none" || error.innerHTML == "*") {
          return;
        }
      
        $(document.body).addClassName("error");
      });
    }
  </script>

</body>
</html>