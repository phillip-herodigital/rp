using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ResponsivePath.Logging;

namespace StreamEnergy.Logging
{
    class StackTraceIndexer : StackTraceAccumulator, ILogIndexer
    {
        public StackTraceIndexer() : base(0, new[] { @" in (.*)\\StreamEnergy" })
        {
        }

        Task ILogIndexer.IndexData(LogEntry logEntry)
        {
            if (logEntry.Data.ContainsKey("StackTraceHash"))
            {
                logEntry.Indexes["StackTraceHash"] = (string)logEntry.Data["StackTraceHash"];
            }

            return Task.FromResult<object>(null);
        }
    }
}
