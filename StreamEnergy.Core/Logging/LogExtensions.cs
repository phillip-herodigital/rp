using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Logging
{
    public static class LogExtensions
    {
        public static Task Record(this ILogger logger, string message, Severity severity)
        {
            return logger.Record(new LogEntry { Message = message, Severity = severity });
        }

        public static Task Record(this ILogger logger, string message, Exception exception, Severity severity = Severity.Error)
        {
            return logger.Record(new LogEntry { Message = message, Severity = severity, Exception = exception });
        }
    }
}
