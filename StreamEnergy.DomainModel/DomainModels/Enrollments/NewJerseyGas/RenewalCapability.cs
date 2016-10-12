﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyGas
{
    [Serializable]
    public class RenewalCapability : ServiceCapability, IRenewalCapability
    {
        public new const string Qualifier = "NewJerseyGasRenewal";

        public override string CapabilityType { get { return Qualifier; } }

        [Newtonsoft.Json.JsonIgnore]
        public override string PODID
        {
            get
            {
                return SubAccount != null ? SubAccount.Id : null;
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
