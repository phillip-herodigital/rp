<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Historical Rates Texas.ascx.cs" Inherits="Website.layouts.Pages.Marketing.Historical_Rates.historical_rates_texas" %>
<%@ Register Assembly="Sitecore.Kernel" Namespace="Sitecore.Web.UI.WebControls" TagPrefix="sc" %>

<article class="marketing">
	<div class="wrapper">
        <h1><%=FieldRenderer.Render(CurrentContextItem, "Header Text") %></h1>
        <p><%=FieldRenderer.Render(CurrentContextItem, "Intro Paragraph") %></p>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Variable Price Plan Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Service Area Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Oncor Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Centerpoint Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP Central Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP North Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "TNMP Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptVariablePricePlan" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdKwh500Label" runat="server"></td>
                            <td id="tdKwh1000Label" runat="server"></td>
                            <td id="tdKwh2000Label" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500OncorPrice" runat="server"></td>
                            <td id="tdKwh1000OncorPrice" runat="server"></td>
                            <td id="tdKwh2000OncorPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500CenterpointPrice" runat="server"></td>
                            <td id="tdKwh1000CenterpointPrice" runat="server"></td>
                            <td id="tdKwh2000CenterpointPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh1000AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh2000AEPCentralPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh1000AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh2000AEPNorthPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500TNMPPrice" runat="server"></td>
                            <td id="tdKwh1000TNMPPrice" runat="server"></td>
                            <td id="tdKwh2000TNMPPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Green and Clean Variable Price Plan Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Service Area Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Oncor Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Centerpoint Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP Central Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP North Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "TNMP Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptGreenAndCleanVariablePricePlan" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdKwh500Label" runat="server"></td>
                            <td id="tdKwh1000Label" runat="server"></td>
                            <td id="tdKwh2000Label" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500OncorPrice" runat="server"></td>
                            <td id="tdKwh1000OncorPrice" runat="server"></td>
                            <td id="tdKwh2000OncorPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500CenterpointPrice" runat="server"></td>
                            <td id="tdKwh1000CenterpointPrice" runat="server"></td>
                            <td id="tdKwh2000CenterpointPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh1000AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh2000AEPCentralPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh1000AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh2000AEPNorthPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500TNMPPrice" runat="server"></td>
                            <td id="tdKwh1000TNMPPrice" runat="server"></td>
                            <td id="tdKwh2000TNMPPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Flex Choice Plan Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Service Area Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Oncor Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Centerpoint Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP Central Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP North Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "TNMP Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptFlexChoicePlan" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdKwh500Label" runat="server"></td>
                            <td id="tdKwh1000Label" runat="server"></td>
                            <td id="tdKwh2000Label" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500OncorPrice" runat="server"></td>
                            <td id="tdKwh1000OncorPrice" runat="server"></td>
                            <td id="tdKwh2000OncorPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500CenterpointPrice" runat="server"></td>
                            <td id="tdKwh1000CenterpointPrice" runat="server"></td>
                            <td id="tdKwh2000CenterpointPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh1000AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh2000AEPCentralPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh1000AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh2000AEPNorthPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500TNMPPrice" runat="server"></td>
                            <td id="tdKwh1000TNMPPrice" runat="server"></td>
                            <td id="tdKwh2000TNMPPrice" runat="server"></td>
                        </tr>
                    </tbody>
                </table>
            </ItemTemplate>
        </asp:Repeater>

        <p><%=FieldRenderer.Render(CurrentContextItem, "Flex Choice Plan - Green and Clean Plan Text") %></p>
        <table>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Service Area Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Oncor Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "Centerpoint Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP Central Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "AEP North Text") %></td>
            </tr>
            <tr>
                <td><%=FieldRenderer.Render(CurrentContextItem, "TNMP Text") %></td>
            </tr>
        </table>
        <asp:Repeater ID="rptFlexChoicePlanGreenAndCleanPlan" runat="server">
            <ItemTemplate>
                <table id="table" runat="server">
                    <thead>
                        <tr>
                            <td id="tdDate" runat="server"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="tdKwh500Label" runat="server"></td>
                            <td id="tdKwh1000Label" runat="server"></td>
                            <td id="tdKwh2000Label" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500OncorPrice" runat="server"></td>
                            <td id="tdKwh1000OncorPrice" runat="server"></td>
                            <td id="tdKwh2000OncorPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500CenterpointPrice" runat="server"></td>
                            <td id="tdKwh1000CenterpointPrice" runat="server"></td>
                            <td id="tdKwh2000CenterpointPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh1000AEPCentralPrice" runat="server"></td>
                            <td id="tdKwh2000AEPCentralPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh1000AEPNorthPrice" runat="server"></td>
                            <td id="tdKwh2000AEPNorthPrice" runat="server"></td>
                        </tr>
                        <tr>
                            <td id="tdKwh500TNMPPrice" runat="server"></td>
                            <td id="tdKwh1000TNMPPrice" runat="server"></td>
                            <td id="tdKwh2000TNMPPrice" runat="server"></td>
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