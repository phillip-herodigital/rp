using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class CaptchaResponse
    {
        public bool Success { get; set; }
        public List<string> ErrorCodes { get; set; }
    }
}