using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.FAQ
{
    public partial class FAQ_Landing : System.Web.UI.UserControl
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var stateFAQs = new Dictionary<string, List<Item>>();
            foreach(Item item in Sitecore.Context.Item.Children)
            {
                var faqStatesField = (MultilistField)item.Fields["FAQ States"];
                foreach (var state in faqStatesField.GetItems())
                {
                    if (!stateFAQs.ContainsKey(state.Name))
                    {
                        stateFAQs.Add(state.Name, new List<Item>());
                    }
                    stateFAQs[state.Name].Add(item);
                }
            }

            if (stateFAQs.ContainsKey("texas")) faqTexas.FAQItems = stateFAQs["texas"];
            if (stateFAQs.ContainsKey("georgia")) faqGeorgia.FAQItems = stateFAQs["georgia"];
            if (stateFAQs.ContainsKey("pennsylvania")) faqPennsylvania.FAQItems = stateFAQs["pennsylvania"];
            if (stateFAQs.ContainsKey("maryland")) faqMaryland.FAQItems = stateFAQs["maryland"];
            if (stateFAQs.ContainsKey("new-jersey")) faqNewJersey.FAQItems = stateFAQs["new-jersey"];
            if (stateFAQs.ContainsKey("new-york")) faqNewYork.FAQItems = stateFAQs["new-york"];
            if (stateFAQs.ContainsKey("washington-dc")) faqWashingtonDC.FAQItems = stateFAQs["washington-dc"];
        }
    }
}