using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    class TexasElectricityMoveInOfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public TexasElectricityMoveInOfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is TexasElectricityMoveInOfferOption;
        }

        public async Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            return new TexasElectricityMoveInOfferOptionRules
            {
                ConnectDates = await enrollmentService.LoadConnectDates(location)
            };
        }
    }
}
