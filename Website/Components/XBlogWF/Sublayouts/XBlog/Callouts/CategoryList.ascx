<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="CategoryList.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.Callouts.CategoryList" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

<div id='<%=settingsItem.PrimaryCSSID%>-CategoryList' >
<asp:ListView ID="lvCategoryList" OnItemDataBound="lvCategoryList_ItemDataBound"  runat="server" >
    <LayoutTemplate>
        <div>
            <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
        </div>
    </LayoutTemplate>
    <ItemTemplate>
            <asp:HyperLink ID="hlCategory" runat="server" />
        <br />
    </ItemTemplate>
</asp:ListView>
</div>