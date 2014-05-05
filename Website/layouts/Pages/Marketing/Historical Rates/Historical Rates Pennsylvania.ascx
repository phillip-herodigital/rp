<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Historical Rates Pennsylvania.ascx.cs" Inherits="StreamEnergy.MyStream.layouts.Pages.Marketing.Historical_Rates.historical_rates_pennsylvania" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing">
	<div class="wrapper">
        <h1><%=FieldRenderer.Render(CurrentContextItem, "Header Text") %></h1>
        <p><%=FieldRenderer.Render(CurrentContextItem, "Intro Paragraph") %></p>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Electricity Month-to-Month Rates Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Duquesne Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PPL Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PECO Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "METED Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "WPP Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PENELEC Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptElectricityMonthToMonthRates" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdDuquesnePrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPPLPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPECOPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdMETEDPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdWPPPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPENELECPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Electricity Green Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Duquesne Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PPL Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PECO Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "METED Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptElectricityGreenRates" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdDuquesnePrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPPLPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPECOPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdMETEDPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Gas Month-to-Month Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PECO Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptGasMonthToMonthRates" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdPECOPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <div><%=FieldRenderer.Render(CurrentContextItem, "Page Bottom Text") %></div>

		<h2><%=FieldRenderer.Render(CurrentContextItem, "Location") %></h2>
        <%=FieldRenderer.Render(CurrentContextItem, "Description") %>
	</div>
</article>