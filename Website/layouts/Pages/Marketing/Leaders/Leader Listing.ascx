<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Leader Listing.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Leaders.Leader_Listing" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<ul class="director clearfix">
    <asp:Repeater ID="rptLeaders" runat="server">
        <ItemTemplate>
            <li>
                <a href="<%# Eval("URL") %>"><%# Eval("Image") %></a>
                <h4><a href="<%# Eval("URL") %>"><%# Eval("FirstName") %></a></h4>
                <h2><a href="<%# Eval("URL") %>"><%# Eval("LastName") %></a></h2>
                <p><%# Eval("Location") %></p>
            </li>
        </ItemTemplate>
    </asp:Repeater>
</ul>