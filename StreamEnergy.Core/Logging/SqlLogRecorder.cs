using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Sitecore.Data.Items;
using Newtonsoft.Json.Serialization;
using ResponsivePath.Logging;

namespace StreamEnergy.Logging
{
    class SqlLogRecorder : ResponsivePath.Logging.SqlLogRecorder
    {
        public SqlLogRecorder([Dependency("settings")]Item settingsItem, EnvironmentCategory environment)
            : base(connectionString: Sitecore.Configuration.Settings.GetConnectionString(settingsItem["ConnectionStringName"]),
                minSeverity: (Severity)Enum.Parse(typeof(Severity), settingsItem["Min Logging Level"]),
                propertiesToIgnore: Parse(settingsItem["PropertiesToMaskInProduction"], environment))
        {
        }

        private static IEnumerable<string> Parse(string propertiesToMaskInProduction, EnvironmentCategory environment)
        {
            if (!string.IsNullOrEmpty(propertiesToMaskInProduction) && environment == EnvironmentCategory.Production)
            {
                return propertiesToMaskInProduction.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
            }
            return Enumerable.Empty<string>();
        }
    }
}
