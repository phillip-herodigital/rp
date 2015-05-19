<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="AuthorList.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.Callouts.AuthorList" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

<div id='<%=settingsItem.PrimaryCSSID%>-AuthorList' >
<asp:ListView ID="lvAuthorList" OnItemDataBound="lvAuthorList_ItemDataBound"  runat="server" >
    <LayoutTemplate>
        <div>
            <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
        </div>
    </LayoutTemplate>
    <ItemTemplate>
            <asp:HyperLink ID="hlAuthor" runat="server" />
        <br />
    </ItemTemplate>
</asp:ListView>
</div>