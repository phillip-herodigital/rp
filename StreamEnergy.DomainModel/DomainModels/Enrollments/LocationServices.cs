﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class LocationServices : ISanitizable
    {
        [ValidateObject(ErrorMessagePrefix = "")]
        public Location Location { get; set; }

        [Required(ErrorMessage = "Selected Offers Required")]
        [EnumerableRequired(ErrorMessage = "Selected Offers Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Selected ")]
        [CollectionCountRangeAttribute(1, int.MaxValue, ErrorMessage = "Selected Offers Required")]
        public SelectedOffer[] SelectedOffers { get; set; }


        void ISanitizable.Sanitize()
        {
            if (Location != null)
                ((ISanitizable)Location).Sanitize();
            if (SelectedOffers != null)
            {
                foreach (var entry in SelectedOffers)
                {
                    ((ISanitizable)entry).Sanitize();
                }
            }
        }
    }
}
