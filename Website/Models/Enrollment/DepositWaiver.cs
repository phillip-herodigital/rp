using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class DepositWaiver
    {
        public Location Location { get; set; }
        public string OfferId { get; set; }
    }
}
