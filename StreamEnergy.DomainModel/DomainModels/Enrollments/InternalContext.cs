using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class InternalContext
    {
        public IEnumerable<IOffer> AllOffers { get; set; }

        public IConnectDatePolicy ConnectPolicy { get; set; }
    }
}
