using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    /// <summary>
    /// Intermediate object to contain the "location" property to help out with the JavaScript code.
    /// </summary>
    public class IntermediateLocation
    {
        public Location Location { get; set; }
    }
}
