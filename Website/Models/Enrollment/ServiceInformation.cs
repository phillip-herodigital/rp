using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class ServiceInformation
    {
        public Dictionary<string, IntermediateLocation> Locations { get; set; }
    }
}