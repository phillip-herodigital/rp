using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy
{
    class SitecoreAccessor : ISitecoreAccessor
    {
        public string GetFieldValue(string itemPath, string field, string defaultValue = null)
        {
            var item = Sitecore.Context.Database.GetItem(itemPath);
            if (item != null)
            {
                return item[field];
            }
            return defaultValue;
        }
    }
}
