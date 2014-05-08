using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class ServiceInformation
    {
        public Address ServiceAddress { get; set; }

        public bool IsNewService { get; set; }
    }
}