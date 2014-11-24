using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    public class RenewalCapability: ServiceCapability
    {
        public new const string Qualifier = "GeorgiaGasRenewal";

        public override string CapabilityType { get { return Qualifier; } }

        [Newtonsoft.Json.JsonIgnore]
        public override string AglcPremisesNumber
        {
            get
            {
                return SubAccount.Id;
            }
            set
            {
                throw new NotSupportedException();
            }
        }

        [Newtonsoft.Json.JsonIgnore]
        public DomainModels.Accounts.Account Account { get; set; }

        [Newtonsoft.Json.JsonIgnore]
        public DomainModels.Accounts.ISubAccount SubAccount { get; set; }
        
    }
}
