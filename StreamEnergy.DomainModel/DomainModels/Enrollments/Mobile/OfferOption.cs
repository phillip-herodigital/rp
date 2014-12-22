using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    public class OfferOption : IOfferOption
    {
        public const string Qualifier = "Mobile";
        
        public string OptionType
        {
            get { return Qualifier; }
        }

        public void Sanitize()
        {
        }

        public DateTime ActivationDate { get; set; }
        public string PhoneNumber { get; set; }
        public string EsnNumber { get; set; }
        public string SimNumber { get; set; }
        public string ImeiNumber { get; set; }
        public string InventoryItemId { get; set; }
        public bool TransferPhoneNumber { get; set; }
    }
}
