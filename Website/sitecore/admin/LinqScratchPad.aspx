<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LinqScratchPad.aspx.cs" Inherits="Sitecore.Buckets.Client.sitecore.admin.LinqScratchPad" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Linq to Sitecore ScratchPad</title>
    <link href="/sitecore/shell/themes/standard/default/WebFramework.css" rel="Stylesheet" />
    <link href="/sitecore/admin/Wizard/UpdateInstallationWizard.css" rel="Stylesheet" />

    <script type="text/javascript" src="/sitecore/shell/Controls/lib/jQuery/jquery.js"></script>

    <script type="text/javascript" src="/sitecore/shell/controls/webframework/webframework.js"></script>
    <script type="text/javascript" src="../../sitecore/shell/Applications/Buckets/libs/jquery-linedtextarea/jquery-linedtextarea.js"></script>
    <link href="../../sitecore/shell/Applications/Buckets/libs/jquery-linedtextarea/jquery-linedtextarea.css" type="text/css" rel="stylesheet" />


</head>
<body>

    <form id="form1" class="wf-container" runat="server">
        <div>
            <div style="padding: 20px;">Enter your code snippet in the following text field, or use the URL field to retrieve a code snippet from an external website.</div>
            <div>
                <div>
                    <asp:TextBox ID="LinqQuery" runat="server" Class="lined" Height="659px" Width="891px" TextMode="MultiLine" Font-Size="11px">
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Web;
    using Sitecore.ContentSearch.SearchTypes;
    using Sitecore.Buckets.Extensions;
    using Sitecore.Buckets.Interfaces;
    using Sitecore.Buckets.Search;
    using Sitecore.Buckets.Search.Tags;
    using Sitecore.Configuration;
    using Sitecore.ContentSearch;
    using Sitecore.ContentSearch.Utilities;
    using Sitecore.Data;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Globalization;
    using Sitecore.SecurityModel;
    using Sitecore.Sites;
    using Sitecore.Web;
    using Sitecore;
    using System.ComponentModel;
    using System.Diagnostics.CodeAnalysis;

    using Sitecore.ContentSearch.Linq;
    using Sitecore.ContentSearch.Linq.Common;

    using Constants = Sitecore.Buckets.Util.Constants;
    using ContentSearchManager = Sitecore.ContentSearch.ContentSearchManager;
                     
    namespace Test {
                    
       class Program {
                        public static IEnumerable&lt;SearchResultItem&gt; Main(string str)
                        {
                            using (var context = ContentSearchManager.GetIndex(&quot;sitecore_master_index&quot;).CreateSearchContext())
                            {
                                return context.GetQueryable&lt;SearchResultItem&gt;().Take(10).ToList();
                            }
                        }
                    }
                  }
                    
        [PredefinedQuery("_templatename", ComparisonType.Contains, "sample")]
        public class TryYourOwnClass {
                    
                    [IndexField("_name")]
                    public string Name {get; set;}
                    
                    [IgnoreIndexFieldAttribute]
                    public string DoNotMapMe { get; set;}
                    }
                    </asp:TextBox>
                </div>

            </div>
            <div class="wf-footer">
                <div style="padding: 10px;">To retrieve a code snippet from an external website, enter the URL and click 'Fetch'. The URL should point to a text file.</div>
                <strong>URL:</strong><asp:TextBox ID="Reference" runat="server" Width="620px"></asp:TextBox>
                <asp:Button ID="Fetch" runat="server" Text="Fetch" OnClick="Fetch_Click" />
            </div>

            <div class="wf-footer">
                <asp:Button ID="btnBack" CssClass="wf-backbutton" Text="Reset" runat="server" />
                <asp:Button ID="clrButton" Text="Clear" runat="server" OnClick="clrButton_Click" />
                <asp:Button ID="btnNext" Text="Run" runat="server" OnClick="btnNext_Click" />
            </div>
            <div class="wf-footer">
                <asp:Literal ID="Output" runat="server"></asp:Literal>
                <asp:Label ID="Error" runat="server"></asp:Label>
            </div>
        </div>
        <div>
        </div>
        <div class="wf-content" style="padding: 2em 100px 0 32px;">
            <asp:Label ID="lblError" CssClass="Error" Visible="false" runat="server"></asp:Label>
            <h1 runat="server" id="lblHeader"></h1>
            <asp:GridView ID="GridResults" runat="server" BackColor="White" BorderColor="Gray" Width="800">
                <AlternatingRowStyle BackColor="Silver" />
                <HeaderStyle BackColor="Gray" />
                <RowStyle Width="600px" />
            </asp:GridView>

        </div>

    </form>
</body>

<script>
    jQuery(function () {
        jQuery(".lined").linedtextarea(
            { selectedLine: 1 }
        );
    });
</script>

</html>
