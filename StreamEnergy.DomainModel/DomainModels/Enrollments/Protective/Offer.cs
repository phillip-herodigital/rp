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

        public int ThreeServiceDiscount { get; set; }

        public int Price { get; set; }

        public string OfferType
        {
            get { return Offer.Qualifier; }
        }

        public string IconURL { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<string> Details { get; set; }

        public int SortOrder { get; set; }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            return container.Resolve<OfferOptionPolicy>();
        }

        public SubOffer GroupOffer { get; set; }

        [Serializable]
        public class SubOffer
        {
            public string Id { get; set; }

            public int Price { get; set; }

            public bool Selected { get; set; }

        }
    }
}
