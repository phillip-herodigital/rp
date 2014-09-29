using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class GeorgiaGasOfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public GeorgiaGasOfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is GeorgiaGasOfferOption;
        }

        public Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            return Task.FromResult<IOfferOptionRules>(new GeorgiaGasOfferOptionRules
            {
            });
        }
    }
}
