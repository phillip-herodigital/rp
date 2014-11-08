using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Renewal
{
    [Serializable]
    class OfferOptionPolicy : IOfferOptionPolicy
    {
        public OfferOptionPolicy(Accounts.Account renewingAccount)
        {
            this.RenewingAccount = renewingAccount;
        }

        public Accounts.Account RenewingAccount { get; private set; }

        bool IOfferOptionPolicy.AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is OfferOption;
        }

        Task<IOfferOptionRules> IOfferOptionPolicy.GetOptionRules(Location location, IOffer offer)
        {
            return Task.FromResult<IOfferOptionRules>(new OfferOptionRules());
        }
    }
}
