using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    public class OfferOption : IOfferOption
    {
        public const string Qualifier = "TexasElectricity";
        public string PreviousProvider { get; set; }

        void ISanitizable.Sanitize()
        {
        }

        public virtual string OptionType
        {
            get { return OfferOption.Qualifier; }
        }

    }
}
