﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    public interface IMobileEnrollmentService
    {
        Task<Guid> RecordEnrollment(UserContext data, byte[] w9Pdf);
        Task<byte[]> RetrievePdf(Guid mobileEnrollmentId);

        Task<string> CreatePdfToken(Guid mobileEnrollmentId);
        Task<byte[]> RetrievePdf(string token);
    }
}
