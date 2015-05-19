<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TagCloud.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.Callouts.TagCloud" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

<div id='<%=settingsItem.PrimaryCSSID%>-TagCloud' >
<asp:ListView ID="lvTagList" OnItemDataBound="lvTagList_ItemDataBound"  runat="server" >
    <LayoutTemplate>
        <div>
            <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
        </div>
    </LayoutTemplate>
    <ItemTemplate>
            <asp:HyperLink ID="hlTag" runat="server" />
    </ItemTemplate>
</asp:ListView>
</div>