using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy
{
    public class NullSettings : ISettings
    {
        public Sitecore.Data.Items.Item GetSettingsItem(string relativePath)
        {
            return null;
        }

        public string GetSettingsValue(string relativePath, string fieldName)
        {
            return null;
        }

        public Sitecore.Data.Fields.Field GetSettingsField(string relativePath, string fieldName)
        {
            return null;
        }
    }
}
