<%@ Page language="c#" AutoEventWireup="True" Inherits="Sitecore.Shell.Applications.Login.Users.UsersPage" CodeBehind="Users.aspx.cs" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.HtmlControls" TagPrefix="sc" %>
<%@ OutputCache Location="None" VaryByParam="none" %>
<!DOCTYPE html>
<html>
<head>
  <title>Sitecore</title>
  <link href="/sitecore/login/default.css" rel="stylesheet" />
</head>
<body class="boost-users">
 <form id="LoginForm" runat="server">
   <input id="ButtonAction" name="ButtonAction" type="hidden" />
   
   <div id="Body">
      <div id="Banner">
        <div id="BannerPartnerLogo">
          <asp:PlaceHolder ID="PartnerLogo" runat="server" />
        </div>
        
        <img id="BannerLogo" src="/sitecore/login/logo.png" alt="Sitecore Logo" border="0" />
      </div>
      
      <div id="Menu">
        &nbsp;
      </div>

      <div id="FullPanel">
        <div id="FullTopPanel">
          <div class="FullTitle"><asp:Literal ID="LblFullTitle" runat="server" /></div>
          <div class="FullText"></div>
        </div>
        
        <div id="MainPanel">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
            <td align="center">
              <div class="FullText"><asp:Literal ID="LblFullText" runat="server" /></div>
            
            <button name="Exit" class="Button" type="submit" onclick="document.getElementById('ButtonAction').value='Exit'">
                <table>
                  <tr>
                    <td><sc:ThemedImage Src="Core2/32x32/close_window.png" runat="server"/></td>
                    <td>
                      <div class="FullButtonHeader">
                        <asp:Literal ID="BtnExitHeader" runat="server" />
                      </div>
                      <div class="FullButtonText">
                        <asp:Literal ID="BtnExitText" runat="server" />
                      </div>
                    </td>
                  </tr>
                </table>
              </button>
              
            <button name="Boost" type="submit" class="Button" onclick="document.getElementById('ButtonAction').value='Boost'">
                <table>
                  <tr>
                    <td><sc:ThemedImage Src="People/32x32/users4_add.png" runat="server"/></td>
                    <td>
                      <div class="FullButtonHeader">
                        <asp:Literal ID="BtnBoostHeader" runat="server" />
                      </div>
                      <div class="FullButtonText">
                        <asp:Literal ID="BtnBoostText" runat="server" />
                      </div>
                    </td>
                  </tr>
                </table>
              </button>

            <button name="Kick" type="submit" class="Button" onclick="document.getElementById('ButtonAction').value='Kick'">
                <table>
                  <tr>
                    <td><sc:ThemedImage Src="People/32x32/user1_delete.png" runat="server"/></td>
                    <td>
                      <div class="FullButtonHeader">
                        <asp:Literal ID="BtnKickHeader" runat="server" />
                      </div>
                      <div class="FullButtonText">
                        <asp:Literal ID="BtnKickText" runat="server" />
                      </div>
                    </td>
                  </tr>
                </table>
              </button>

            </td>
          </tr>
        </table>
      </div>
      
    </div>
  </form>
</body>
</html>

