using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Renewal
{
    [Serializable]
    public class Offer : IOffer
    {
        public const string Qualifier = "Renewal";

        public string Id
        {
            get { return ""; }
        }

        public string OfferType
        {
            get { return Offer.Qualifier; }
        }

        public string Name
        {
            get { return ""; }
        }

        public string Description
        {
            get { return ""; }
        }

        [Newtonsoft.Json.JsonIgnore]
        public Accounts.Account RenewingAccount { get; set; }

        public IOfferOptionPolicy GetOfferOptionPolicy(Microsoft.Practices.Unity.IUnityContainer container)
        {
            return new OfferOptionPolicy(RenewingAccount);
        }

        public Accounts.ISubAccount RenewingSubAccount { get; set; }
    }
}
