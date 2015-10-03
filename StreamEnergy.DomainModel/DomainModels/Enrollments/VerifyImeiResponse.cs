using StreamEnergy.DomainModels.Enrollments.Mobile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class VerifyImeiResponse
    {
        public VerifyEsnResponseCode VerifyEsnResponseCode { get; set; }
        public string DeviceType { get; set; }
        public string ICCID { get; set; }
        public bool IsValidImei { get; set; }
        public MobileServiceProvider Provider { get; set; }
        public string Manufacturer { get; set; }
    }
}
