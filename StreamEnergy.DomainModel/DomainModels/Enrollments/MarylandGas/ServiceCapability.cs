﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.MarylandGas
{
    [Serializable]
    public class ServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "MarylandGas";

        public virtual string CapabilityType { get { return Qualifier; } }

        public virtual string PreviousAccountNumber { get; set; }

        string ISearchable.GetUniqueField()
        {
            return PreviousAccountNumber;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return PreviousAccountNumber == ((ServiceCapability)obj).PreviousAccountNumber;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (PreviousAccountNumber ?? "").GetHashCode();
        }

        public string Zipcode { get; set; }

    }
}
