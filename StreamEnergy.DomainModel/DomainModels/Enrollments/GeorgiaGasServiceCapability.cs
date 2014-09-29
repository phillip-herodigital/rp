﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class GeorgiaGasServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "GeorgiaGas";

        public string CapabilityType { get { return Qualifier; } }

        public string AglAccountNumber { get; set; }

        string ISearchable.GetUniqueField()
        {
            return AglAccountNumber;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return AglAccountNumber == ((GeorgiaGasServiceCapability)obj).AglAccountNumber;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (AglAccountNumber ?? "").GetHashCode();
        }

        public string Zipcode { get; set; }

    }
}
