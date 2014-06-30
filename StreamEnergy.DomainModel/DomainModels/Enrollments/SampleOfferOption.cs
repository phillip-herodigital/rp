using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class SampleOfferOption : IOfferOption
    {
        public string OptionType { get; set; }
        public Address BillingAddress { get; set; }

        public void Sanitize()
        {
        }

    }
}
