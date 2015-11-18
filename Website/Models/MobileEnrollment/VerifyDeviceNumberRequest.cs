using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class VerifyDeviceNumberRequest
    {
        public string Imei { get; set; }
        public string Captcha { get; set; }
        public bool Success { get; set; }
    }
}