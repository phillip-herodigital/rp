﻿using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class SelectedOffer : ISanitizable, IValidatableObject
    {
        [Required(ErrorMessage = "Offer Required")]
        public IOffer Offer { get; set; }

        [Required(ErrorMessage = "Offer Option Required")]
        public IOfferOption OfferOption { get; set; }

        public bool DepositAlternative { get; set; }
        public bool WaiveDeposit { get; set; }

        void ISanitizable.Sanitize()
        {
            if (OfferOption != null)
            {
                OfferOption.Sanitize();
            }
        }

        IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            var container = (IUnityContainer)validationContext.GetService(typeof(IUnityContainer));
            if (Offer != null && OfferOption != null)
            {
                var policy = Offer.GetOfferOptionPolicy(container);
                if (!policy.AcceptsOptions(OfferOption))
                {
                    // This is really a developer error. The user was allowed to provide options for an offer that didn't match the offer.
                    // At the time of writing this validation, I don't have concrete examples, but it's like giving electricity connect date
                    // to the Tech Support Home Life Services product.
                    yield return new ValidationResult("Offer Option Invalid", new[] { "OfferOption" });
                }
            }
        }
    }
}
