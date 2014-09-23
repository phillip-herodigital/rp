using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    [Serializable]
    public class UserContext : ISanitizable
    {
        [Required(ErrorMessage = "Personal Info Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public CustomerContact ContactInfo { get; set; }

        [Required(ErrorMessage = "Billing Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Billing Address ")]
        public Address BillingAddress { get; set; }

        [Required(ErrorMessage = "Shipping Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Shipping Address ")]
        public Address ShippingAddress { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public DomainModels.Payments.IPaymentInfo PaymentInfo { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public bool AgreeToTerms { get; set; }

        void ISanitizable.Sanitize()
        {
            if (ContactInfo != null)
                ((ISanitizable)ContactInfo).Sanitize();
            if (BillingAddress != null)
                ((ISanitizable)BillingAddress).Sanitize();
            if (ShippingAddress != null)
                ((ISanitizable)ShippingAddress).Sanitize();

        }

    }
}
