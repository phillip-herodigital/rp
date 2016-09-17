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
        public IEnumerable<string> ExcludedStates { get; set; }
        public IEnumerable<string> VideoConferenceStates { get; set; }
        public float Price { get; set; }
        public float ThreeServiceDiscount { get; set; }
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
        public bool IsGroupOffer { get; set; }
        public bool HasGroupOffer { get; set; }
        public string AssociatedOfferId { get; set; }
    }
}
