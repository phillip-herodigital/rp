<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BlogListing.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.BlogListing" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

    <div id='<%=settingsItem.PrimaryCSSID%>' >
        <h1><sc:Text runat="server" ID="scTitle" Field="Blog Name" /></h1>
        <asp:ListView ID="lvBlogPosts" OnItemDataBound="lvBlogPosts_ItemDataBound"  runat="server" >
            <LayoutTemplate>
                <div class="container-wrapper">
                    <div class="container-fluid">
                        <asp:PlaceHolder ID="itemPlaceholder" runat="server" />
                    </div>
                </div>
            </LayoutTemplate>
            <ItemTemplate>
                <div itemprop="headline">
                    <h2><asp:HyperLink runat="server" ID="hlTitle" /></h2>
                    <!--<sc:Text runat="server" ID="scBlogPostTitle" Field="Title" />-->
                </div>
                <div class="set" itemprop="datePublished">
                    Published on <sc:Text runat="server" ID="SCBlogPostPublishDate" Field="Publish Date" />
                </div>
                <div class="set" itemprop="author">
                    by <asp:Literal runat="server" ID="litAuthor" />      
                </div>              

                <sc:Text runat="server" ID="scBlogPostSummary" Field="Summary" />
                        
                <div itemprop="articleSection">
                    <asp:Literal runat="server" ID="litCategories" />
                </div>
                        
                <br />
            </ItemTemplate>
        </asp:ListView>
    </div>
