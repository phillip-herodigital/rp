using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    [Serializable]
    public class Offer : IOffer
    {
        public const string Qualifier = "Mobile";
        
        public string Id { get; set; }

        public string Provider { get; set; }

        public string Code { get; set; }

        public string Product { get; set; }

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

        public IList<Rate> Rates { get; set; }

        public int Term { get; set; }

        public MobileInventory[] MobileInventory { get; set; }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            return container.Resolve<OfferOptionPolicy>();
        }
    }
}
