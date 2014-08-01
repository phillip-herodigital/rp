using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Logging
{
    public interface ILogIndexer
    {
        Task IndexData(LogEntry logEntry);
    }
}
