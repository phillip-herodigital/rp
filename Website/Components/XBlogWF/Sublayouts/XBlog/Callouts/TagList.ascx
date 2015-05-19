<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TagList.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.Callouts.TagList" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

<div id='<%=settingsItem.PrimaryCSSID%>-TagList' >
<asp:ListView ID="lvTagList" OnItemDataBound="lvTagList_ItemDataBound"  runat="server" >
    <LayoutTemplate>
        <div>
            <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
        </div>
    </LayoutTemplate>
    <ItemTemplate>
            <asp:HyperLink ID="hlTag" runat="server" />
        <br />
    </ItemTemplate>
</asp:ListView>
</div>