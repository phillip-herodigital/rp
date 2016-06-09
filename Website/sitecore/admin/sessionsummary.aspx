<%@ Page Language="C#" %>
<%@ Import Namespace="Sitecore.ExM.Framework.Data" %>
<%@ Import Namespace="Sitecore.ExM.Framework.Distributed.Sessions" %>
<%@ Import Namespace="Sitecore.ExM.Framework.Distributed.Members" %>
<%@ Import Namespace="System.Xml" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Diagnostics" %>

<script runat="server">

    // Data containers
    protected class Owner
    {
        public string OwnerName { get; set; }
        public DateTime LastActivity { get; set; }
        public string Status { get; set; }
        public DistributedSession[] ActiveSessions { get; set; }
    }

    protected class DistributedSession
    {
        public Guid SessionId { get; set; }
        public string Health { get; set; }
        public string HealthColor { get; set; }
        public DistributedActivity[] Activities { get; set; }
    }

    protected class DistributedActivity
    {
        public string Identifier { get; set; }
        public string Health { get; set; }
        public string HealthColor { get; set; }
        public KeyValuePair<string, string>[] Statistics { get; set; }
    }

    // Data binding
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!this.IsPostBack)
        {
            sessionProvidersRepeater.DataSource = LoadSessionProvidersFromConfig("exm/sessionProviders");
            sessionProvidersRepeater.DataBind();
        }
    }

    // Get data
    private static Owner[] GetData(object item)
    {
        var keyValuePair = item as KeyValuePair<string, ISessionDataProvider>? ?? new KeyValuePair<string, ISessionDataProvider>();
        var provider = keyValuePair.Value;
        if (provider != null)
        {
            var reader = new EnvironmentReader(provider);
            SessionsByOwnerResult sessionsByOwner = reader.GetSessionsByOwner(true, false, true);

            return sessionsByOwner.Owners.Select(ToOwner).ToArray();
        }
        return null;
    }

    private static Dictionary<string, ISessionDataProvider> LoadSessionProvidersFromConfig(string pathToConfigNode)
    {
        XmlNode configNode = Factory.GetConfigNode(pathToConfigNode);
        Assert.IsNotNull(configNode, "No config node found for {0}!", pathToConfigNode);

        var sessionDataProviders = new Dictionary<string, ISessionDataProvider>();

        foreach (object childNode in configNode.ChildNodes)
        {
            var sessionProviderNode = childNode as XmlElement;
            if (sessionProviderNode == null)
            {
                continue;
            }

            if (sessionProviderNode.HasAttributes && sessionProviderNode.HasAttribute("type"))
            {
                var provider = Sitecore.Configuration.Factory.CreateObject(string.Format("{0}/{1}", pathToConfigNode, sessionProviderNode.LocalName), true) as ISessionDataProvider;
                sessionDataProviders.Add(sessionProviderNode.LocalName, provider);
            }
        }

        return sessionDataProviders;
    }

    private static Owner ToOwner(OwnerInfo ownerInfo)
    {
        string status;
        switch (ownerInfo.RecentSession.SessionState)
        {
            case SessionState.Active:
                status = "Online";
                break;
            case SessionState.Ended:
                status = "Shut down";
                break;
            default:
                status = "Crashed";
                break;
        }

        Owner result = new Owner()
        {
            OwnerName = ownerInfo.OwnerName,
            LastActivity = ownerInfo.RecentSession.TimeStamp,
            Status = status,
            ActiveSessions = ownerInfo.ActiveSessions.Select(ToDistributedSession).ToArray()
        };

        return result;
    }

    private static DistributedSession ToDistributedSession(SessionInfo sessionInfo)
    {
        bool isHealthy = sessionInfo.IsHealthy;

        DistributedSession result = new DistributedSession
        {
            SessionId = sessionInfo.SessionId.Guid,
            Health = isHealthy ? "Healthy" : "Not healthy",
            HealthColor = isHealthy ? "limegreen" : "tomato",
            Activities = sessionInfo.Activities.Select(ToDistributedActivity).ToArray()
        };

        return result;
    }

    private static DistributedActivity ToDistributedActivity(ActivityInfo activityInfo)
    {
        bool isHealthy = activityInfo.IsHealthy;

        DistributedActivity result = new DistributedActivity
        {
            Identifier = activityInfo.Identifier,
            Health = isHealthy ? "Healthy" : "Not healthy",
            HealthColor = isHealthy ? "limegreen" : "tomato",
            Statistics = ToStatistics(activityInfo.Statistics)
        };

        return result;
    }

    private static KeyValuePair<string, string>[] ToStatistics(ReadOnlySerializationCollection collection)
    {
        IList<StringId> keys = collection.Keys.ToList();

        KeyValuePair<string, string>[] result = keys.Select(key =>
        {
            string keyName = (char.ToUpper(key.Value[0]) + key.Value.Substring(1)).Replace('_', ' ');
            object value = collection.Get(key) ?? string.Empty;

            return new KeyValuePair<string, string>(keyName, value.ToString());
        }).ToArray();

        return result;
    }

</script>

<html>
<head>
    <title>Distributed Session Summary</title>
</head>
<body style="font-family: sans-serif;">
<form runat="server">
    <div>
        <asp:Repeater ID="sessionProvidersRepeater" runat="server">
            <ItemTemplate>
                <div style="font-size: x-large;"><%# DataBinder.Eval((System.Collections.Generic.KeyValuePair<string, ISessionDataProvider>)Container.DataItem, "Key") %></div>
                <hr/>
                <asp:Repeater ID="ownersRepeater" DataSource='<%# GetData(Container.DataItem) %>' runat="server">
                    <ItemTemplate>
                        <div style="font-size: large;"><%# this.Eval("OwnerName") %></div>
                        <div style="font-size: small;"><%# this.Eval("Status") %> (<%# this.Eval("LastActivity") %>)</div>
                        
                        <asp:Repeater DataSource='<%# this.Eval("ActiveSessions") %>' runat="server">
                            <ItemTemplate>
                                <div style="background-color: aliceblue;">
                                    <div>
                                        <strong><%# this.Eval("SessionId") %></strong> <span style="font-size: small; color: <%# this.Eval("HealthColor") %>;">(<%# this.Eval("Health") %>)</span>
                                    </div>

                                    <ul>
                                        <asp:Repeater DataSource='<%# this.Eval("Activities") %>' runat="server">
                                            <ItemTemplate>
                                                <li>
                                                    <strong><%# this.Eval("Identifier") %></strong> <span style="font-size: small; color: <%# this.Eval("HealthColor") %>;">(<%# this.Eval("Health") %>)</span>
                                                    <br/>
                                                    <table style="font-style: italic">
                                                        <asp:Repeater DataSource='<%# this.Eval("Statistics") %>' runat="server">
                                                            <ItemTemplate>
                                                                <tr style="font-size: small;">
                                                                    <td><%# this.Eval("Key") %>:</td>
                                                                    <td><%# this.Eval("Value") %></td>
                                                                </tr>
                                                            </ItemTemplate>
                                                        </asp:Repeater>
                                                    </table>
                                                </li>
                                            </ItemTemplate>
                                        </asp:Repeater>
                                    </ul>
                                </div>
                            </ItemTemplate>
                        </asp:Repeater>
                    </ItemTemplate>
                    <FooterTemplate>
                        </div>
                    </FooterTemplate>
                </asp:Repeater>
            </ItemTemplate>
        </asp:Repeater>
    </div>
</form>
</body>
</html>