using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class AdditionalIdentityInformation
    {
        public string PreviousIdentityCheckId { get; set; }

        public Dictionary<string, string> SelectedAnswers { get; set; }
    }
}
