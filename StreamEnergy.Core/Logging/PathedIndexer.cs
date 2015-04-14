using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Sitecore.Data.Items;

namespace StreamEnergy.Logging
{
    class PathedIndexer : ResponsivePath.Logging.PathedIndexer
    {
        public PathedIndexer([Dependency("settings")]Item settingsItem)
            : base(ReadNameValueColllection(settingsItem))
        {
        }

        private static System.Collections.Specialized.NameValueCollection ReadNameValueColllection(Item settingsItem)
        {
            var paths = ((Sitecore.Data.Fields.NameValueListField)settingsItem.Fields["Indexes"]).NameValues;
            var result = new NameValueCollection();
            foreach (var indexKey in paths.AllKeys)
            {
                foreach (var path in paths.GetValues(indexKey))
                {
                    result.Add(indexKey, System.Web.HttpUtility.UrlDecode(path));
                }
            }

            return result;
        }
    }
}
