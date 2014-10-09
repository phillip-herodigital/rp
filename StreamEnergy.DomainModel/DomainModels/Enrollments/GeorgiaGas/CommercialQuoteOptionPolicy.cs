using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    class CommercialQuoteOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public CommercialQuoteOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is CommercialQuoteOption;
        }

        public async Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().FirstOrDefault();
            IConnectDatePolicy policy = null;
            if (serviceStatus != null && serviceStatus.EnrollmentType == EnrollmentType.MoveIn)
            {
                policy = await enrollmentService.LoadConnectDates(location, offer);
            }

            return new CommercialQuoteOptionRules
            {
                ConnectDates = policy,
            };
        }
    }
}
