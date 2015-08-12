using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;
using ResponsivePath.Logging;

namespace StreamEnergy.Logging
{
    public class ReadOnlyLogEntry : LogEntry
    {
        public new JToken Exception { get; set; }
    }
}
