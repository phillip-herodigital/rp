<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PathAnalyzer.aspx.cs" Inherits="Sitecore.PathAnalyzer.Client.Sitecore.Admin.PathAnalyzer" %>

<%@ Import Namespace="Sitecore.PathAnalyzer.Data.Models" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Path Analyzer Admin Utilities</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <link rel="stylesheet" type="text/css" href="/sitecore/shell/Controls/Lib/jQuery/jQueryUI/1.10.3/smoothness/jquery-ui-1.10.3.min.css" />
    <style type="text/css">
        .wf-content .section {
            margin: 0px 0px 20px 0px;
        }

            .wf-content .section h3 {
                margin: 0px 0px 10px 0px;
            }

        .wf-content.manager table td {
            padding: 5px;
        }

        .wf-content .form-group {
            margin: 0px 0px 10px 0px;
        }

        .wf-content.properties table td {
            padding: 5px;
        }

        div:empty {
            display: none;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server" class="wf-container">
        <div class="wf-content">
            <h1>Path Analyzer Utilities</h1>
        </div>
        <div class="wf-content manager">
            <h2>Maps Manager</h2>
            <p class="wf-subtitle">Showing all maps and their deployment status. You can deploy individual maps or deploy all maps that are not deployed.</p>
            <div class="wf-configsection">
                <div class="section">
                    <h3>Total maps: <asp:Literal runat="server" ID="ltlMapCount" /></h3>
                    <h3>Total maps deployed: <asp:Literal runat="server" ID="ltlMapsDeployedCount" /></h3>
                </div>
                <div class="wf-statebox wf-statebox-error" style="margin: 2em 0"><asp:Literal ID="ltlManagerError" runat="server" /></div>
                <div class="wf-statebox wf-statebox-success" style="margin: 2em 0"><asp:Literal ID="ltlManagerMessage" runat="server" /></div>
                <div class="section">
                    <asp:Repeater ID="rptMaps" runat="server" OnItemCommand="rptMaps_OnItemCommand">
                        <HeaderTemplate>
                            <table class="maps">
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Deployment Status</th>
                                </tr>
                        </HeaderTemplate>
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <%# ((Map)Container.DataItem).Name %>
                                </td>
                                <td>
                                    <%# ((Map)Container.DataItem).Id %>
                                </td>
                                <td>
                                    <asp:Literal runat="server" ID="ltlDeployed" Text="Already Deployed" Visible="<%# ((Map)Container.DataItem).Deployed %>" />
                                    <asp:Button runat="server" ID="btnDeploy" Text="Deploy" CommandName="Deploy" CommandArgument="<%# ((Map)Container.DataItem).Id %>" Visible="<%# !((Map)Container.DataItem).Deployed %>" />
                                </td>
                            </tr>
                        </ItemTemplate>
                        <FooterTemplate></table></FooterTemplate>
                    </asp:Repeater>
                </div>
                <div class="section">
                    <asp:Button Text="Deploy all maps" runat="server" ID="btnDeployAllMaps" OnClick="btnDeployAllMaps_OnClick" />
                </div>
            </div>
        </div>
        <div class="wf-content builder">
            <h2>Historic Map Rebuild</h2>
            <div class="wf-statebox wf-statebox-success" style="margin: 2em 0"><asp:Literal ID="rebuildStatusLiteral" runat="server" /></div>
            <div class="wf-statebox wf-statebox-error" style="margin: 2em 0"><asp:Literal ID="rebuildStatusErrorLiteral" runat="server" /></div>
            <div class="wf-statebox wf-statebox-warning" style="margin: 2em 0">
                This process will rebuild all currently deployed maps from historic data in XDB.
                <br />
                Depending on the number of interactions in XDB and the processing power, this could be a very expensive operation.
                <br />
                <b>Important: </b>This feature is not expected to work in setups where processing server is separated from the reporting server. Please refer to the Knowledge Base for more details.
            </div>
            <asp:Button runat="server" ID="btnRebuildAllDeployedMaps" Text="Rebuild" OnClick="btnRebuildAllDeployedMaps_OnClick" />
        </div>
        <div class="wf-content builder">
            <h2>Agents</h2>
            <p class="wf-subtitle">
                Use the options in this section to force trigger agents, which are normally configured to run on interval basis.
            </p>
            <div class="wf-configsection">
                <div class="wf-statebox wf-statebox-success" style="margin: 2em 0"><asp:Literal ID="ltlBuilderMessage" runat="server" /></div>
                <div class="wf-statebox wf-statebox-error" style="margin: 2em 0"><asp:Literal ID="ltlBuilderError" runat="server" /></div>
                <div class="section">
                    <h3>Daily Map Agent</h3>
                    <div class="wf-statebox wf-statebox-warning" style="margin: 2em 0">
                        This will result in trees built for all deployed maps for the selected day.
                        <br />
                        If trees for the selected day are already present in RDB, the agent will skip.
                    </div>
                    <div class="form-group">
                        <label runat="server" id="lblDailyAgentEndDate" for="tbDailyAgentEndDate">Pick date: </label>
                        <input type="text" id="tbDailyAgentEndDate" runat="server" class="form-control" />
                    </div>
                    <asp:Button ID="btnDailyMapAgent" runat="server" Text="Run Daily Map Agent" OnClick="btnRunDailyMapAgent_OnClick" />
                </div>
                <div class="section">
                    <h3>New Map Agent</h3>
                    <div class="wf-statebox wf-statebox-warning" style="margin: 2em 0">
                        <b>Important: </b>The agent will do work only if new maps have been deployed.
                        <br />
                        In other words, if value of the 'PathAnalyzer_newmaps' record is present in the Properties table in RDB.
                    </div>
                    <asp:Button ID="btnNewMapAgent" runat="server" Text="Run New Map Agent" OnClick="btnRunNewMapAgent_OnClick" />
                </div>
            </div>
        </div>
        <div class="wf-content properties">
            <h2>Property Store</h2>
            <p class="wf-subtitle">This section provides debugging information from the maps property store which is used to coordinate various map construction features.</p>
            <div class="wf-configsection">
                <div class="wf-statebox wf-statebox-success" style="margin: 2em 0"><asp:Literal ID="ltlPropertiesMessage" runat="server" /></div>
                <div class="section">
                    <h3>Property Store Keys/Values</h3>
                    <asp:Repeater runat="server" ID="rptProperties">
                        <HeaderTemplate>
                            <table>
                                <tr>
                                    <th>Key</th>
                                    <th>Value</th>
                                </tr>
                        </HeaderTemplate>
                        <ItemTemplate>
                            <tr>
                                <td>
                                    <%# ((KeyValuePair<string,string>)Container.DataItem).Key %>
                                </td>
                                <td>
                                    <%# ((KeyValuePair<string,string>)Container.DataItem).Value %>
                                </td>
                            </tr>
                        </ItemTemplate>
                        <FooterTemplate></table></FooterTemplate>
                    </asp:Repeater>
                </div>
            </div>
        </div>
    </form>

    <script type="text/javascript" src="/sitecore/shell/controls/lib/jQuery/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="/sitecore/shell/Controls/Lib/jQuery/jQueryUI/1.10.3/jquery-ui-1.10.3.min.js"></script>

    <script type="text/javascript">
        jQuery(document).ready(function () {
            jQuery('#tbDailyAgentEndDate').datepicker({
                maxDate: "0",
                onClose: function (selectedDate) {
                }
            });
        });
    </script>

    <%--
    The webframework.js code has an error trying to test for "jquery.browser.msie".
    Be sure to load any custom scripts before this file.
    --%>
    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>

</body>
</html>
