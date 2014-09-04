using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class TexasElectricityOfferOption : IOfferOption
    {
        public const string Qualifier = "TexasElectricity";

        void ISanitizable.Sanitize()
        {
        }

        public virtual string OptionType
        {
            get { return TexasElectricityOfferOption.Qualifier; }
        }

    }
}
