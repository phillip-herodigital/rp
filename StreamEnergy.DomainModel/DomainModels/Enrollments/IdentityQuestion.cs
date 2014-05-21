using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class IdentityQuestion
    {
        public string QuestionId { get; set; }

        public string QuestionText { get; set; }

        public IdentityAnswer[] Answers { get; set; }
    }
}
