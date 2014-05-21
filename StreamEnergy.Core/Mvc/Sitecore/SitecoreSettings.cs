using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.SecurityModel;

namespace StreamEnergy.Mvc.Sitecore
{
    class SitecoreSettings : ISettings
    {
        private readonly ISitecoreContext sitecoreContext;
        private readonly string environment;

        public SitecoreSettings(ISitecoreContext sitecoreContext, EnvironmentCategory environment)
        {
            this.sitecoreContext = sitecoreContext;
            this.environment = environment.ToString();
        }

        public Item GetSettingsItem(string relativePath)
        {
            return GetSettingsItems(relativePath).FirstOrDefault();
        }

        public string GetSettingsValue(string relativePath, string fieldName)
        {
            return GetSettingsItems(relativePath)
                .Select(item => item[fieldName])
                .Where(v => !string.IsNullOrEmpty(v))
                .FirstOrDefault();
        }

        private IEnumerable<Item> GetSettingsItems(string relativePath)
        {
            // we don't need to check security settings for reading the item
            using (new SecurityDisabler())
            {
                var baseItem = sitecoreContext.Database.SelectSingleItem("fast://sitecore/content/data/Settings/" + relativePath);
                if (baseItem == null)
                    yield break;
                var child = baseItem.Axes.GetChild(environment);
                if (child != null)
                    yield return child;
                yield return baseItem;
            }
        }
    }
}
