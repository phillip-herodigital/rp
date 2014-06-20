using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Service
{
    [Serializable]
    public class IdentityCheckResult
    {
        public string IdentityCheckId { get; set; }

        public IdentityQuestion[] IdentityQuestions { get; set; }

        public IdentityCheckHardStop? HardStop { get; set; }

        public bool IdentityAccepted { get; set; }
    }
}
