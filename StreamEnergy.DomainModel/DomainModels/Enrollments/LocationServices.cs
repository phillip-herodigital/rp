using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class LocationServices : ISanitizable
    {
        [Required(ErrorMessage = "Service Location Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public Location Location { get; set; }

        [Required(ErrorMessage = "Selected Offers Required")]
        [EnumerableRequired(ErrorMessage = "Selected Offers Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Selected ")]
        [CollectionCountRangeAttribute(1, int.MaxValue, ErrorMessage = "Selected Offers Required")]
        public Dictionary<string, SelectedOffer> SelectedOffers { get; set; }


        void ISanitizable.Sanitize()
        {
            if (Location != null)
                ((ISanitizable)Location).Sanitize();
            if (SelectedOffers != null)
            {
                foreach (var entry in SelectedOffers)
                {
                    ((ISanitizable)entry.Value).Sanitize();
                }
            }
        }
    }
}
