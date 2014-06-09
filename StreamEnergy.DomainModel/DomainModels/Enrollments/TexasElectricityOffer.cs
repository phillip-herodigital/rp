using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class TexasElectricityOffer : IOffer
    {
        public const string Qualifier = "TexasElectricity";

        public string Id { get; set; }

        public string OfferType
        {
            get { return TexasElectricityOffer.Qualifier; }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            return container.Resolve<TexasElectricityOfferOptionPolicy>();
        }
    }
}
