<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="BlogPostSL.ascx.cs" Inherits="XBlogWF.Components.XBlogWF.Sublayouts.XBlog.BlogPostSL" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Kernel" %>

<div id='<%=settingsItem.PrimaryCSSID%>' >

    <div itemprop="headline">
        <h1><sc:Text runat="server" ID="scTitle" Field="Title" /></h1>
    </div>

    <div class="set" itemprop="author"><!-- Authors --></div>
    <div class="set" itemprop="datePublished"><!-- Publish Date --></div>



    <div itemprop="articleBody">
        <sc:Text runat="server" ID="scBody" Field="Body" />
    </div>
    <div itemprop="articleSection"><!-- Categories --></div>



    <div itemprop="comment"><!-- Comments --></div>
    <div itemprop="commentCount"><!-- CommentCount --></div>
</div>