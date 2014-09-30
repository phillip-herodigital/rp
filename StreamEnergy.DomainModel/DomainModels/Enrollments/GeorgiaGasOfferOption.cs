using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class GeorgiaGasOfferOption : IOfferOption
    {
        public const string Qualifier = "GeorgiaGas";

        void ISanitizable.Sanitize()
        {
        }

        public virtual string OptionType
        {
            get { return GeorgiaGasOfferOption.Qualifier; }
        }

    }
}
