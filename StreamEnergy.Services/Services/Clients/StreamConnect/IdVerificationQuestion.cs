using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class IdVerificationQuestion
    {
        public int Index { get; set; }
        public string QuestionText { get; set; }
        public IEnumerable<Answer> Answers { get; set; }
    }
}
