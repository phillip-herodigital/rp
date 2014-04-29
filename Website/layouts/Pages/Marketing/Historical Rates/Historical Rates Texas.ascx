<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Historical Rates Texas.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Historical_Rates.historical_rates_texas" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing">
	<div class="wrapper">
        <h1><%=FieldRenderer.Render(CurrentContextItem, "Header Text") %></h1>
        <p><%=FieldRenderer.Render(CurrentContextItem, "Intro Paragraph") %></p>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Variable Price Plan Text") %></p>
        <asp:Repeater ID="rptVariablePricePlan" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500OncorPrice" runat="server"></td>
                            <td id="tdKwh1000OncorPrice" runat="server"></td>
                            <td id="tdKwh2000OncorPrice" runat="server"></td>
                        </tr>
                    </thead>
                </table>
            </ItemTemplate>
        </asp:Repeater>

		<h2><%=FieldRenderer.Render(CurrentContextItem, "Location") %></h2>
        <%=FieldRenderer.Render(CurrentContextItem, "Description") %>
	</div>
</article>