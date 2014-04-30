<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FAQ Listing.ascx.cs" Inherits="Website.layouts.Pages.Marketing.FAQ.FAQ_Listing" %>

<asp:Repeater ID="rptFAQs" runat="server">
    <ItemTemplate>
        <h2><%# Eval("Question") %></h2>
        <%# Eval("Answer") %>
    </ItemTemplate>
</asp:Repeater>