﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Protective
{
    [Serializable]
    public class ServiceCapability : IServiceCapability
    {
        public const string Qualifier = "Protective";

        public string CapabilityType { get { return Qualifier; } }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return true;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode();
        }
    }
}
