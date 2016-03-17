using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class SinglePage
    {
        public Location ServiceLocation { get; set; }
        public string PlanId { get; set; }
    }
}
