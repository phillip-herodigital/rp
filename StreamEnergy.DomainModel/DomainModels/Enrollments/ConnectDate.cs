using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class ConnectDate
    {
        public DateTime Date { get; set; }
        public ConnectDateClassification Classification { get; set; }
        public Dictionary<string, decimal> Fees { get; set; }
    }
}
