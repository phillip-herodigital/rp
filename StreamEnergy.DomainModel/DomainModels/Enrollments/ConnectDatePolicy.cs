using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class ConnectDatePolicy : IConnectDatePolicy
    {
        public IEnumerable<ConnectDate> AvailableConnectDates { get; set; }
    }
}
