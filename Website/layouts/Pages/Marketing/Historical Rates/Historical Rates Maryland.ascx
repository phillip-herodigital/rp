<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Historical Rates Maryland.ascx.cs" Inherits="StreamEnergy.MyStream.layouts.Pages.Marketing.Historical_Rates.historical_rates_maryland" %>
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
                <td><%=FieldRenderer.Render(CurrentContextItem, "BGE Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PEPCO Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Delmarva Text") %></td>
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
                            <td id="tdBGEPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPEPCOPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdDelmarvaPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Electricity Green and Clean Month-to-Month Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "BGE Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "PEPCO Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Delmarva Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptElectricityGreenAndCleanMonthToMonthRates" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdBGEPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdPEPCOPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdDelmarvaPrice" runat="server"></td>
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
                <td><%=FieldRenderer.Render(CurrentContextItem, "BGE Text") %></td>
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
                            <td id="tdBGEPrice" runat="server"></td>
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