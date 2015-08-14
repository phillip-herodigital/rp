using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class VerifyEsnResponse
    {
        public VerifyEsnResponseCode VerifyEsnResponseCode { get; set; }
        public string DeviceType { get; set; }
        public string ICCID { get; set; }
    }
}
