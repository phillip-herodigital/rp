using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    public class OfferOption : IOfferOption
    {
        public const string Qualifier = "GeorgiaGas";

        void ISanitizable.Sanitize()
        {
        }

        public virtual string OptionType
        {
            get { return OfferOption.Qualifier; }
        }

    }
}
