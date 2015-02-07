using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    [Serializable]
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
        public string EsnNumber { get; set; }
        public string SimNumber { get; set; }
        public string ImeiNumber { get; set; }
        public string IccidNumber { get; set; }
        public string InventoryItemId { get; set; }
        public bool UseInstallmentPlan { get; set; }
        
        [ValidateObject]
        public TransferInfo TransferInfo { get; set; }
    }
}
