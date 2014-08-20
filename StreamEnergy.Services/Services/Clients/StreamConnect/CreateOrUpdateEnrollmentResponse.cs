using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class CreateOrUpdateEnrollmentResponse
    {
        public string StreamReferenceNumber { get; set; }
        public string CisAccountNumber { get; set; }
        public Guid GlobalEnrollmentAccountId { get; set; }
    }
}
