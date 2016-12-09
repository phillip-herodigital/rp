using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyGas
{
    [Serializable]
    public abstract class OfferOption : IOfferOption
    {
        public const string Qualifier = "NewJerseyGas";

        void ISanitizable.Sanitize()
        {
            Sanitize();
        }

        public abstract string PreviousProvider { get; set; }

        protected virtual void Sanitize()
        {
            throw new NotImplementedException();
        }

        public abstract string OptionType { get; }
    }
}
