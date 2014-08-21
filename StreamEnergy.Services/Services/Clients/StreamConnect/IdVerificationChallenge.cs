using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class IdVerificationChallenge
    {
        public string CreditServiceSessionId { get; set; }
        public IEnumerable<IdVerificationQuestion> Questions { get; set; }
    }
}
