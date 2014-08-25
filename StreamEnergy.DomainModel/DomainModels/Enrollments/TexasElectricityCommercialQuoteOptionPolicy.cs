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
            return offerOption is TexasElectricityOfferOption;
        }

        public async Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            return new TexasElectricityCommercialQuoteOptionRules
            {
                ConnectDates = await enrollmentService.LoadConnectDates(location)
            };
        }
    }
}
