using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Logging
{
    public interface ILogger
    {
        Task Record(LogEntry logEntry);

        IList<IDataAccumulator> Accumulators { get; }
        IList<ILogIndexer> Indexers { get; }
        IList<ILogRecorder> Recorders { get; }
    }
}
