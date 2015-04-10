using System;
using System.Collections.Generic;
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
            : base(((Sitecore.Data.Fields.NameValueListField)settingsItem.Fields["Indexes"]).NameValues)
        {
        }
    }
}
