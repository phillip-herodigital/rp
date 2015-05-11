<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RebuildReportingDB.aspx.cs" Inherits="Sitecore.sitecore.admin.Aggregation" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Rebuild Reporting Database</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
    <style type="text/css">
        .wf-container
        {
            min-width: 950px;
            display: inline-block;
            width: auto;
        }

        .wf-content
        {
            padding: 2em 2em;
        }

        #wf-dropshadow-right
        {
            display: none;
        }
        
        table.main
        {
            border: 1px solid #ccc;
            border-collapse: collapse;
            font-family: Tahoma;
            font-size: 14pt;
            padding: 1em 1em;
        }
        
        table.main td
        {
            font-family: Tahoma;
            font-size: 14pt;
            border: 1px solid #ccc;
            padding: 5px;
        }

        table.main th
        {
            font-family: Tahoma;
            font-size: 14pt;
            text-align: center;
            border: 1px solid #ccc;
            font-weight: normal;
            padding: 5px;
        }

        .wf-configsection table th {
            background-color: #ccc;
        }
        
        td.datacell {
            text-align: right;
            white-space: nowrap;
        }

        table.main th.dataheader {
            text-align: center;
        }

        tr.groupheader {
            background-color: #bbb;
        }

        .top1 {
            background-image: url(/sitecore/shell/themes/Standard/Images/PipelineProfiling/font_char49_red_16.png);
            background-repeat: no-repeat;
            background-position: 5px 5px;
        }
        .top2 {
            background-image: url(/sitecore/shell/themes/Standard/Images/PipelineProfiling/font_char50_orange_16.png);
            background-repeat: no-repeat;
            background-position: 5px 5px;
        }
        .top3 {
            background-image: url(/sitecore/shell/themes/Standard/Images/PipelineProfiling/font_char51_yellow_16.png);
            background-repeat: no-repeat;
            background-position: 5px 5px;
        }

        table.main td.processor {
            padding-left: 30px;
        }
    </style>
</head>
<body>
    <form id="mainForm" runat="server" class="wf-container">
        <div class="wf-content">        
        <h1>Rebuild Reporting Database</h1>
        <asp:ScriptManager runat="server"></asp:ScriptManager>
        <asp:Timer ID="ProgressTimer" Interval="4000" runat="server" OnTick="ProgressTimer_Tick"></asp:Timer>
        <asp:UpdatePanel runat="server">
            <ContentTemplate>
                <p />
                <p />
                <asp:Button runat="server" ID="StartButton" OnClick="StartClick" Text="Start" />
                <asp:Button runat="server" ID="CancelButton" OnClick="CancelClick" Text="Cancel" />
                <asp:Button runat="server" ID="pauseOrResumeButton" OnClick="PauseOrResumeClick" Text="Pause/Resume" Visible="False"/>
                <p />
                <asp:Label runat="server" ID="MissingConnStringMsg" ForeColor="red"></asp:Label>
                <p />
                <p />

                <asp:Table ID="TableOverallStatus" runat="server" Width="450">
                    <asp:TableHeaderRow ID="TableHeaderOverallStatus" runat="server">
                        <asp:TableHeaderCell ID="TableHeaderCellOverallStatus" runat="server" ColumnSpan="1" HorizontalAlign="Left">
                    Overall Status
                        </asp:TableHeaderCell>
                    </asp:TableHeaderRow>

                    <asp:TableRow ID="TableRowOverallState" runat="server">
                        <asp:TableCell ID="TableCellOverallStateKey" runat="server">
                    Process State:
                        </asp:TableCell>
                        <asp:TableCell ID="TableCellOverallStateValue" runat="server" HorizontalAlign="Right">
                        <asp:Label runat="server" ID="ProcesStateLabel" />
                        </asp:TableCell>
                    </asp:TableRow>

                    <asp:TableRow ID="TableRowError" runat="server">
                        <asp:TableCell ID="TableCell1" runat="server">
                    Last stored error:
                        </asp:TableCell>
                        <asp:TableCell ID="TableCell2" runat="server" HorizontalAlign="Right">
                        <asp:Label runat="server" ID="ErrorLabel" />
                        </asp:TableCell>
                    </asp:TableRow>

                    <asp:TableRow ID="TableRowIsActive" runat="server" Visible="False">
                        <asp:TableCell ID="TableCellIsActiveKey" runat="server">
                    Is Active:
                        </asp:TableCell>
                        <asp:TableCell ID="TableCellIsActiveValue" runat="server" HorizontalAlign="Right">
                            <asp:Label runat="server" ID="IsActiveLabel" />
                        </asp:TableCell>
                    </asp:TableRow>

                    <asp:TableRow ID="TableRowCutoff" runat="server" Visible="False">
                        <asp:TableCell ID="TableCellCutoffKey" runat="server">
                    Cutoff Time (Server Time):
                        </asp:TableCell>
                        <asp:TableCell ID="TableCellCutoffValue" runat="server" HorizontalAlign="Right">
                            <asp:Label runat="server" ID="CutoffLabel" />
                        </asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow ID="TableRowStartedAt" runat="server">
                        <asp:TableCell ID="TableCellStartedAtKey" runat="server">
                    Started at (Server Time):
                        </asp:TableCell>
                        <asp:TableCell ID="TableCellStartedAtValue" runat="server" HorizontalAlign="Right">
                            <asp:Label runat="server" ID="StartedAtLabel" />
                        </asp:TableCell>
                    </asp:TableRow>
                    <asp:TableRow ID="TableRowFinishedAt" runat="server">
                        <asp:TableCell ID="TableCellFinishedAtKey" runat="server">
                    Last Process State Change At (Server Time):
                        </asp:TableCell>
                        <asp:TableCell ID="TableCellFinishedAtValue" runat="server" HorizontalAlign="Right">
                            <asp:Label runat="server" ID="LastChangedLabel" />
                        </asp:TableCell>
                    </asp:TableRow>                    
                </asp:Table>
            </ContentTemplate>
            <Triggers>
                <asp:AsyncPostBackTrigger ControlID="ProgressTimer" EventName="Tick" />
            </Triggers>
        </asp:UpdatePanel>
    </div>
    </form>
</body>
</html>
