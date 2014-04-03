<%@ Page Language="C#" MasterPageFile="~/sitecore/shell/Applications/Buckets/ItemBucketsSearchResult.Master" AutoEventWireup="true" CodeBehind="IFrameField.aspx.cs" Inherits="Sitecore.Buckets.Module.IFrameField" %>

<%@ Register TagPrefix="sc" TagName="BucketSearchUI" Src="BucketSearchUI.ascx" %>
<%@ OutputCache Location="None" VaryByParam="none" %>

<asp:Content ContentPlaceHolderID="head" runat="server">
</asp:Content>

<asp:Content ContentPlaceHolderID="body" runat="server">
    <sc:BucketSearchUI BucketsView="Field" runat="server" />
</asp:Content>