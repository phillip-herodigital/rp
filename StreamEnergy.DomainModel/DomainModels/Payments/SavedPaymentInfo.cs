using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    [Serializable]
    public class SavedPaymentInfo : IPaymentInfo
    {
        public const string Qualifier = "SavedPaymentMethod";

        public string PaymentType
        {
            get { return Qualifier; }
        }

        [Required]
        public Guid Id { get; set; }

        [Required]
        public string UnderlyingPaymentType { get; set; }
        [Required]
        public string UnderlyingType { get; set; }
        [Required]
        public string DisplayName { get; set; }
        public string RedactedData { get; set; }
    }
}
