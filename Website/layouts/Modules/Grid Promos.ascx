<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Grid Promos.ascx.cs" Inherits="Website.layouts.Modules.GridPromos" %>

<article class="marketing gridPromos">
	<div class="wrapper">
		<div id="divGrid" class="grid" runat="server">
            <asp:Repeater ID="rptPromoItems" runat="server">
                <ItemTemplate>
                    <div class="col <%# Eval("CssClasses") %>">
				        <%# Eval("Image") %>
				        <h4><%# Eval("Header") %></h4>
				        <p><%# Eval("Content") %></p>
				        <p><%# Eval("Button") %></p>
			        </div>
                </ItemTemplate>
            </asp:Repeater>
		</div>
	</div>
</article>