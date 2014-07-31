using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StreamEnergy.Logging
{
    class StackTraceIndexer : IDataAccumulator, ILogIndexer
    {
        Task IDataAccumulator.AccumulateData(LogEntry logEntry)
        {
            logEntry.Data["StackTrace"] = Environment.StackTrace;
            return Task.FromResult<object>(null);
        }

        Task ILogIndexer.IndexData(LogEntry logEntry)
        {
            var stackTrace = (string)logEntry.Data["StackTrace"];
            var rootPath = Regex.Match(stackTrace, @" in (.*)\\StreamEnergy").Groups[1].Value;
            var limited = stackTrace.Replace(rootPath, "");
            var hash = Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(limited)));
            logEntry.Indexes["StackTraceHash"] = hash;

            return Task.FromResult<object>(null);
        }
    }
}
