using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.Historical_Rates
{
    public partial class historical_rates_texas : BaseLayout
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            rptVariablePricePlan.DataSource = Sitecore.Context.Item.Children["Variable Price Plan"].Children;
            rptVariablePricePlan.ItemDataBound += rptVariablePricePlan_ItemDataBound;
            rptVariablePricePlan.DataBind();
        }

        void rptVariablePricePlan_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            var item = e.Item.DataItem as Item;
            var table = e.Item.FindControl("table") as HtmlTable;
            var tdDate = e.Item.FindControl("tdDate") as HtmlTableCell;

            table.Attributes["class"] = (e.Item.ItemIndex % 2 == 0) ? "alt" : "";
            tdDate.InnerHtml = FieldRenderer.Render(item, "Date");

            var list = new List<KeyValuePair<string, string>>()
            {
                new KeyValuePair<string, string>("tdKwh500OncorPrice", "500 kWh Oncor Price"),
                new KeyValuePair<string, string>("tdKwh1000OncorPrice", "1000 kWh Oncor Price"),
                new KeyValuePair<string, string>("tdKwh2000OncorPrice", "2000 kWh Oncor Price"),
            };

            foreach(var kvp in list)
            {
                var td = e.Item.FindControl(kvp.Key) as HtmlTableCell;
                td.InnerHtml = FieldRenderer.Render(item, kvp.Value);
                td.Visible = !string.IsNullOrEmpty(td.InnerHtml);
            }
        }
    }
}