using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class VerifyPremiseResponse
    {
        public string FailureReason { get; set; }
        public bool IsEligibleField { get; set; }
        public string UtilityAccountNumberField { get; set; }
    }
}
