using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.Logging;

namespace StreamEnergy.UserMigration.Kubra
{
    class SimpleLogger : ILogger
    {
        System.Threading.Tasks.Task ILogger.Record(LogEntry logEntry)
        {
            return System.Threading.Tasks.Task.FromResult<object>(null);
        }

        IList<IDataAccumulator> ILogger.Accumulators
        {
            get { return new List<IDataAccumulator>(); }
        }

        IList<ILogIndexer> ILogger.Indexers
        {
            get { return new List<ILogIndexer>(); }
        }

        IList<ILogRecorder> ILogger.Recorders
        {
            get { return new List<ILogRecorder>(); }
        }
    }
}
