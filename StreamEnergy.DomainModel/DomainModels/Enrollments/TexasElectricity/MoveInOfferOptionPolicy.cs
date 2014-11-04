using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    class MoveInOfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public MoveInOfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is MoveInOfferOption;
        }

        public async Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            if (location.Capabilities.OfType<ServiceCapability>().Single().EsiId == null)
            {
                return new MoveInOfferOptionRules { ConnectDates = null };
            }
            return new MoveInOfferOptionRules
            {
                ConnectDates = await enrollmentService.LoadConnectDates(location, offer)
            };
        }
    }
}
