using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    class TexasElectricityCommercialQuoteOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public TexasElectricityCommercialQuoteOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is TexasElectricityCommercialQuoteOption;
        }

        public async Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().FirstOrDefault();
            IConnectDatePolicy policy = null;
            if (serviceStatus != null && serviceStatus.EnrollmentType == EnrollmentType.MoveIn)
            {
                policy = await enrollmentService.LoadConnectDates(location);
            }

            return new TexasElectricityCommercialQuoteOptionRules
            {
                ConnectDates = policy,
            };
        }
    }
}
