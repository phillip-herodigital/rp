<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Applicationsiconlist.ascx.cs"
    Inherits="Sitecore.Speak.WebSite.Applicationsiconlist" %>
<asp:Panel CssClass="app-list" runat="server" ID="appList">
    <asp:ObjectDataSource runat="server" ID="Applications" TypeName="Sitecore.Speak.WebSite.Applicationsiconlist" 
        SelectMethod="GetApplications" />
    <asp:Repeater ID="Repeater1" runat="server" DataSourceID="Applications">
        <ItemTemplate>
            <asp:HyperLink ID="hlPath" runat="server" NavigateUrl='<%# DataBinder.Eval(Container.DataItem, "Path") %>' ToolTip='<%# DataBinder.Eval(Container.DataItem, "DisplayName")%>'>
            
                <asp:Image ID="imgIcon" AlternateText="&nbsp;" src='<%# DataBinder.Eval(Container.DataItem, "Icon") %>' runat="server"/><asp:label runat="server" ID="lblTitle" Text='<%# DataBinder.Eval(Container.DataItem, "DisplayName")%>'></asp:label></asp:HyperLink>
        </ItemTemplate>
    </asp:Repeater>
</asp:Panel>
