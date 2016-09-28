using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Enrollments.Protective
{
    [Serializable]
    public class Offer : IOffer
    {
        public const string Qualifier = "Protective";
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<string> SubOfferGuids { get; set; }
        public string OfferType
        {
            get { return Offer.Qualifier; }
        }
        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            return container.Resolve<OfferOptionPolicy>();
        }
    }
}
