<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="Sitecore.Diagnostics" %>
<%@ Import Namespace="Sitecore.ExperienceAnalytics.Api" %>
<%@ Import Namespace="EAC=Sitecore.ExperienceAnalytics.Client" %>
<%@ Import Namespace="Sitecore.ExperienceAnalytics.Core.Diagnostics" %>
<%@ Import Namespace="Sitecore.ExperienceAnalytics.Core.Repositories.Contracts" %>
<%@ Import Namespace="Sitecore.ExperienceAnalytics.Core.Repositories.Model" %>
<%@ Import Namespace="Sitecore.Workflows" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="Sitecore.Sites" %>
<%@ Import Namespace="Sitecore" %>
<%@ Import Namespace="Sitecore.Data.Fields" %>

<script runat="server">

    private const string DisabledAnalytics = "Error: Experience Analytics is disabled. In the Sitecore.Analytics.config file, set the Analytics.Enabled setting to <i>true</i>. <br />";
    private const string NoSiteContext = "Error: The context website is not available. <br />";
    private const string NoSegmentDefinitionService = "Error: The SegmentDefinitionService object is not available. <br />";
    private const string NoSegmentRepository = "Error: The SegmentRepository object is not available. <br />";
    private const string NoWorkflowProvider = "Error: The WorkflowProvider object is not available. <br />";
    private const string NoItemFormat = "Skipped: The {0} ({1}) segment does not contain an item. <br /><br />";
    private const string NoWorkflowStateFormat = "Skipped: The {0} ({1}) segment does not contain a workflow state field. <br /><br />";
    private const string NoWorkflowFormat = "Skipped: The {0} ({1}) segment was not deployed. The segment item is not assigned to a workflow. <br /><br />";
    private const string WorkflowStateChangedFormat = "The {0} ({1}) segment has been moved to a different workflow state. <br />";
    private const string IncorrectWorkflowStateFormat = "Skipped: The {0} ({1}) segment is not in the <i>Deployed</i> workflow state. <br /><br />";
    private const string WorkflowStateNotChangedFormat = "The {0} ({1}) segment has not been moved to a different workflow state. <br />";
    private const string SegmentDeployedFormat = "Deployed: The {0} ({1}) segment has been deployed. <br /><br />";
    private const string DeployFinished = "<b> Finished: {0} segments have been deployed sucessfully. {1} segments have been skipped.</b>";

    /// <summary>
    /// Load method for page
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public void Page_Load(object sender, EventArgs e)
    {
        CheckSecurity();
    }

    /// <summary>
    /// Starts redeployment
    /// </summary>
    public void Redeploy()
    {
        if (Request.Form["RedeploySegments"] == null && Request.Form["RedeployMaps"] == null)
        {
            return;
        }
        
        if (Sitecore.Context.Site == null)
        {
            Response.Write(NoSiteContext);
            return;
        }

        var reportDataCache = Sitecore.Caching.CacheManager.FindCacheByName("ReportDataCache");

        if (reportDataCache != null)
        {
            reportDataCache.Clear();
        }
        
        if (Sitecore.Context.Site.EnableWorkflow)
        {
            if (Request.Form["RedeployMaps"] == null)
            {
                DeploySegments();
            }
            else
            {
                DeployMaps();
            }
        }
        else
        {
            var shellContext = SiteContextFactory.GetSiteContext("shell");

            if (shellContext != null)
            {
                using (new SiteContextSwitcher(shellContext))
                {
                    if (Request.Form["RedeployMaps"] == null)
                    {
                        DeploySegments();
                    }
                    else
                    {
                        DeployMaps();
                    }
                }
            }
        }
    }

    /// <summary>
    /// Deploys default segments
    /// </summary>
    private void DeploySegments()
    {
        pnlResults.Visible = true;

        if (!Sitecore.Configuration.Settings.Analytics.Enabled)
        {
            Response.Write(DisabledAnalytics);
            return;
        }

        if (Config.MasterDatabase.WorkflowProvider == null)
        {
            Response.Write(NoWorkflowProvider);
            return;
        }

        var segmentDefService = ApiContainer.Repositories.GetSegmentDefinitionService();
        if (segmentDefService == null)
        {
            Response.Write(NoSegmentDefinitionService);
            return;
        }

        var segmentRepository = EAC.ClientContainer.Repositories.GetSegmentRepository();
        if (segmentRepository == null)
        {
            Response.Write(NoSegmentRepository);
            return;
        }

        var allSegments = segmentRepository.GetAll();
        var segmentsFromDb = segmentDefService.GetSegmentDefinitions();

        var segmentsToDeploy = allSegments.Where(seg => !segmentsFromDb.Any(dbSeg => dbSeg.Id == seg.Id));

        int processedSegments = 0;
        int skippedSegments = 0;
        
        foreach (var segment in segmentsToDeploy)
        {
            Item item = Config.MasterDatabase.GetItem(Sitecore.Data.ID.Parse(segment.Id));
            if (item == null)
            {
                Response.Write(string.Format(WorkflowStateNotChangedFormat, segment.Title, segment.Id.ToString()));
                Response.Write(string.Format(NoItemFormat, segment.Title, segment.Id.ToString()));
                Response.Flush();
                skippedSegments++;
                
                continue;
            }

            IWorkflow workflow = Config.MasterDatabase.WorkflowProvider.GetWorkflow(item);
            if (workflow == null)
            {
                Response.Write(string.Format(WorkflowStateNotChangedFormat, item.Name, item.ID.ToString()));
                Response.Write(string.Format(NoWorkflowFormat, item.Name, item.ID.ToString()));
                Response.Flush();
                skippedSegments++;
                
                continue;
            }

            Field field = item.Fields["__Workflow state"];
            if (field == null)
            {
                Response.Write(string.Format(WorkflowStateNotChangedFormat, item.Name, item.ID.ToString()));
                Response.Write(string.Format(NoWorkflowStateFormat, item.Name, item.ID.ToString()));
                Response.Flush();
                skippedSegments++;
                
                continue;
            }

            if (!field.Value.Equals(EAC.Globals.WorkflowStates.SegmentInitializing, StringComparison.OrdinalIgnoreCase))
            {
                item.Editing.BeginEdit();
                field.Value = EAC.Globals.WorkflowStates.SegmentInitializing;
                item.Editing.EndEdit();

                Response.Write(string.Format(WorkflowStateChangedFormat, item.Name, item.ID.ToString()));
            }
            else
            {
                Response.Write(string.Format(WorkflowStateNotChangedFormat, item.Name, item.ID.ToString()));
                Response.Write(string.Format(IncorrectWorkflowStateFormat, item.Name, item.ID.ToString()));
                Response.Flush();
                skippedSegments++;
                
                continue;
            }

            workflow.Execute(EAC.Globals.WorkflowCommands.DeploySegment, item, string.Empty, false);

            Response.Write(string.Format(SegmentDeployedFormat, item.Name, item.ID.ToString()));
            Response.Flush();
            
            processedSegments++;
        }
        
        Response.Write(string.Format(DeployFinished, processedSegments, skippedSegments));
    }

    private const string NoMapRepository = "Error: The MapRepository object is not available. <br />";
    private const string NoTreeDefinitionService = "Error: The TreeDefinitionService object is not available. <br />";
    private const string NoMapDefinitionItems = "Error: No maps were found. <br />";
    private const string MapNoWorkflowStateFormat = "Skipped: The {0} ({1}) map does not contain a workflow state field. <br /><br />";
    private const string MapNoWorkflowFormat = "Skipped: The {0} ({1}) map was not deployed. The segment item is not assigned to a workflow. <br /><br />";
    private const string MapWorkflowStateChangedFormat = "The {0} ({1}) map has been moved to a different workflow state. <br />";
    private const string MapIncorrectWorkflowStateFormat = "Skipped: The {0} ({1}) map is not in the <i>Deployed</i> workflow state. <br /><br />";
    private const string MapWorkflowStateNotChangedFormat = "The {0} ({1}) map has not been moved to a different workflow state. <br />";
    private const string MapDeployedFormat = "Deployed: The {0} ({1}) map has been deployed. <br /><br />";
    private const string MapDeployFinishedFormat = "<b> Finished: {0} maps have been deployed sucessfully. {1} maps have been skipped. </b>";
    
    /// <summary>
    /// Deploys default maps
    /// </summary>
    private void DeployMaps()
    {
        pnlResults.Visible = true;

        var mapRepository = Sitecore.PathAnalyzer.ApplicationContainer.GetMapRepository();

        if (mapRepository == null)
        {
            Response.Write(NoMapRepository);
            return;
        }
        
        var treeDefsService = Sitecore.PathAnalyzer.ApplicationContainer.GetDefinitionService();

        if (treeDefsService == null)
        {
            Response.Write(NoTreeDefinitionService);
            return;
        }

        IEnumerable<Item> mapItems = mapRepository.GetAllMapItems();

        if (mapItems == null)
        {
            Response.Write(NoMapDefinitionItems);
            return;
        }

        var mapsInDb = treeDefsService.GetAllDefinitions() ?? new List<Sitecore.PathAnalyzer.Data.Models.TreeDefinition>();

        int processedMaps = 0;
        int skippedMaps = 0;

        mapItems = mapItems.Where(map => !mapsInDb.Any(dbMap => dbMap.Id == map.ID.Guid));

        foreach (Item mapItem in mapItems)
        {
            IWorkflow workflow = Config.MasterDatabase.WorkflowProvider.GetWorkflow(mapItem);
            if (workflow == null)
            {
                Response.Write(string.Format(MapWorkflowStateNotChangedFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Write(string.Format(MapNoWorkflowFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Flush();

                skippedMaps++;
                continue;
            }

            Field field = mapItem.Fields["__Workflow state"];
            if (field == null)
            {
                Response.Write(string.Format(MapWorkflowStateNotChangedFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Write(string.Format(MapNoWorkflowStateFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Flush();

                skippedMaps++;
                continue;
            }

            if (!field.Value.Equals(Sitecore.PathAnalyzer.Constants.WorkflowIDs.InitializingState, StringComparison.OrdinalIgnoreCase))
            {
                mapItem.Editing.BeginEdit();
                field.Value = Sitecore.PathAnalyzer.Constants.WorkflowIDs.InitializingState;
                mapItem.Editing.EndEdit();

                Response.Write(string.Format(MapWorkflowStateChangedFormat, mapItem.Name, mapItem.ID.ToString()));
            }
            else
            {
                Response.Write(string.Format(MapWorkflowStateNotChangedFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Write(string.Format(MapIncorrectWorkflowStateFormat, mapItem.Name, mapItem.ID.ToString()));
                Response.Flush();

                skippedMaps++;
                continue;
            }
            
            workflow.Execute(Sitecore.PathAnalyzer.Constants.WorkflowIDs.DeployCommand, mapItem, string.Empty, false);
            
            Response.Write(string.Format(MapDeployedFormat, mapItem.Name, mapItem.ID.ToString()));
            Response.Flush();
            
            processedMaps++;
        }
        
         Response.Write(string.Format(MapDeployFinishedFormat, processedMaps, skippedMaps));
    }

    /// <summary>
    /// Checks the security.
    /// </summary>
    /// <returns></returns>
    protected void CheckSecurity()
    {
        if (Sitecore.Context.User.IsAdministrator)
        {
            return;
        }

        SiteContext site = Sitecore.Context.Site;

        string loginPage = (site != null ? site.LoginPage : string.Empty);

        if (loginPage.Length > 0)
        {
            Response.Redirect(loginPage, true);
        }
    }
</script>

<!DOCTYPE html>

<html>
<head runat="server">
    <title>Redeploy Marketing Data</title>
    <link rel="shortcut icon" href="/sitecore/images/favicon.ico" />
    <link rel="Stylesheet" type="text/css" href="/sitecore/shell/themes/standard/default/WebFramework.css" />
</head>
<body>
    <form id="form2" runat="server" class="wf-container">
        <div class="wf-content">
            <h2>Redeploy segments</h2>
            <p class="wf-subtitle">Redeploy the default Experience Analytics segments and populate the database.</p>
            <p class="wf-subtitle">This process performs two tasks:</p>
            <ol>
                <li>Moves each deployed segment that does not have any data in the <i>Analytics</i> database to the <i>Initializing</i> workflow state.</li>
                <li>Redeploys each segment.</li>
            </ol>
            <p class="wf-subtitle">
                Note: Only segments that are in the <i>Deployed</i> workflow state and that do not have any data in the <i>Analytics</i> database will be redeployed.
            </p>
            <p>
                <input type="submit" name="RedeploySegments" value="Redeploy segments"/>
            </p>

            <br />

            <h2>Redeploy maps</h2>
            <p class="wf-subtitle">Redeploy the default Path Analyzer maps and populate the database.</p>
            <p class="wf-subtitle">This process performs two tasks:</p>
            <ol>
                <li>Moves each deployed map that does not have any data in the <i>Analytics</i> database to the <i>Initializing</i> workflow state.</li>
                <li>Redeploys each map.</li>
            </ol>
            <p class="wf-subtitle">
                Note: Only maps that are in the <i>Deployed</i> workflow state and that do not have any data in the <i>Analytics</i> database will be redeployed.
            </p>
            <p>
                <input type="submit" name="RedeployMaps" value="Redeploy maps"/>
            </p>
  
            <asp:Panel ID="pnlResults" runat="server">
                <div class="wf-configsection">
                    <h2><span>Result</span></h2>
                    <p>
                        <% Redeploy(); %>
                    </p>
                </div>
            </asp:Panel>
        </div>
    </form>
</body>
</html>
