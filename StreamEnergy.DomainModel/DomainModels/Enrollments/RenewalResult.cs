using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class RenewalResult
    {
        public bool IsSuccess { get; set; }

        public DateTime RenewalDate { get; set; }

        public DateTime ContractStartDate { get; set; }

        public DateTime ContractEndDate { get; set; }

        public string ConfirmationNumber { get; set; }
    }
}
