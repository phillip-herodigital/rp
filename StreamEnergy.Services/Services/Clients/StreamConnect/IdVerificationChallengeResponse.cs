using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class IdVerificationChallengeResponse
    {
        public string Status { get; set; }
        public IdVerificationChallenge IdVerificationChallenge { get; set; }
    }
}
