using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Logging
{
    public interface IDataAccumulator
    {
        Task AccumulateData(LogEntry logEntry);
    }
}
