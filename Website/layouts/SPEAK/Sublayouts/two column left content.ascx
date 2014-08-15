<%@ Control Language="c#" AutoEventWireup="true" Inherits="System.Web.UI.UserControl" %>
<div class="app-task">
    <div class="right-content">
        <sc:placeholder id="phRightColumn" key="side" runat="server" />
    </div>
    <div class="main-content">  
        <sc:placeholder ID="phCommands" key="commands" runat="server" />
        <asp:panel ID="MainContent" runat="server">
            <sc:placeholder ID="phContent" key="content" runat="server" />
        </asp:panel>
    </div>
</div>
