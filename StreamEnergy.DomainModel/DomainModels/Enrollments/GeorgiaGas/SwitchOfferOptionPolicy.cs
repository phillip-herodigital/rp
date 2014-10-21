using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    public class SwitchOfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public SwitchOfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is SwitchOfferOption;
        }

        public Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            return Task.FromResult<IOfferOptionRules>(new SwitchOfferOptionRules
            {
            });
        }
    }
}
