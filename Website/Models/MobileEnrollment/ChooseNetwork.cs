using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class ChooseNetwork
    {
        public IEnumerable<DomainModels.MobileEnrollment.MobileNetwork> MobileNetworks;
    }
}