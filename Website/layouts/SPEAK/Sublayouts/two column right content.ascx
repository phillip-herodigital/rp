<%@ Control Language="c#" AutoEventWireup="true" Inherits="System.Web.UI.UserControl" %>
<div class="app-content">
    <div class="main-content">
        <sc:Placeholder ID="phCommands" Key="commands" runat="server" />
        <asp:Panel ID="MainContent" runat="server">
            <sc:Placeholder ID="phContent" Key="content" runat="server" />
        </asp:Panel>
    </div>
    <div class="left-content">
        <sc:Placeholder ID="phLeftColumn" Key="side" runat="server" />
    </div>
</div>
