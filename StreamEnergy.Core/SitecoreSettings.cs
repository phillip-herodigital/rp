using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.SecurityModel;

namespace StreamEnergy
{
    class SitecoreSettings : ISettings
    {
        private readonly string environment;

        public SitecoreSettings(EnvironmentCategory environment)
        {
            this.environment = environment.ToString();
        }

        public Item GetSettingsItem(string relativePath, string database = null)
        {
            return GetSettingsItems(relativePath, database).FirstOrDefault();
        }

        public string GetSettingsValue(string relativePath, string fieldName, string database = null)
        {
            return GetSettingsItems(relativePath, database)
                .Select(item => item[fieldName])
                .Where(v => !string.IsNullOrEmpty(v))
                .FirstOrDefault();
        }

        public Field GetSettingsField(string relativePath, string fieldName, string database = null)
        {
            return GetSettingsItems(relativePath, database)
                .Select(item => item.Fields[fieldName])
                .Where(v => v != null)
                .FirstOrDefault();
        }

        private IEnumerable<Item> GetSettingsItems(string relativePath, string database = null)
        {
            // we don't need to check security settings for reading the item
            using (new SecurityDisabler())
            {
                var sitecoreDatabase = Sitecore.Context.Database;
                if (!string.IsNullOrEmpty(database))
                {
                    sitecoreDatabase = Sitecore.Data.Database.GetDatabase(database);
                }
                var baseItem = sitecoreDatabase.GetItem("/sitecore/content/data/Settings/" + relativePath);
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
