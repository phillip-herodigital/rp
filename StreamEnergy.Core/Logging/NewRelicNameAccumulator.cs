using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Logging;

namespace StreamEnergy.Logging
{
    public class NewRelicNameAccumulator : IDataAccumulator
    {
        public void AccumulateData(LogEntry logEntry)
        {
            logEntry.Data["ApplicationName"] = ConfigurationManager.AppSettings["NewRelic.AppName"];
        }
    }
}
