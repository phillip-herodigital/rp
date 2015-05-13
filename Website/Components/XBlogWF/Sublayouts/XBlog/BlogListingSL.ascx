<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BlogListingSL.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.BlogListingSL" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

    <div class="eminem">
        <h1><sc:Text runat="server" ID="scTitle" Field="Blog Name" /></h1>
        <asp:ListView ID="lvBlogPosts" runat="server" DataSourceID="dsBlogPost" OnItemDataBound="lvBlogPosts_ItemDataBound" OnDataBound="lvBlogPosts_DataBound">
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
                    <asp:Literal runat="server" ID="litTags" />
                </div>
                        
                <br />
            </ItemTemplate>
        </asp:ListView>
    </div>


<asp:ObjectDataSource ID="dsBlogPost" runat="server" MaximumRowsParameterName="maximumRows" OnSelecting="BlogPost_Selecting"
    StartRowIndexParameterName="startRowIndex" EnablePaging="true" TypeName="AR.Website.Sublayouts.Common.Content.Blogs.BlogDataSource" SelectCountMethod="GetResultCount" SelectMethod="GetBlogPosts">
    <SelectParameters>
        <asp:Parameter Type="String" Name="tags" />
        <asp:Parameter Type="String" Name="author" />
        <asp:Parameter Type="String" Name="category" />
    </SelectParameters>
</asp:ObjectDataSource>
