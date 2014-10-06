using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    public class OfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public OfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is OfferOption;
        }

        public Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            return Task.FromResult<IOfferOptionRules>(new OfferOptionRules
            {
            });
        }
    }
}
