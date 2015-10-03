using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class VerifyDeviceNumberResponse
    {
        public bool IsEligible { get; set; }
        public VerifyEsnResponseCode VerifyEsnResponseCode { get; set; }
        public string DeviceType { get; set; }
        public string ICCID { get; set; }
        public string NetworkType { get; set; }
        public string Manufacturer { get; set; }
    }
}