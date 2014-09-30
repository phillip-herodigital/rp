using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class CreateOrUpdateEnrollmentResponse
    {
        public string EnrollmentReferenceNumber { get; set; }
        public Guid GlobalEnrollmentAccountId { get; set; }
    }
}
