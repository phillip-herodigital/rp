using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public abstract class OfferOption : IOfferOption
    {
        public const string Qualifier = "NewYorkGas";

        void ISanitizable.Sanitize()
        {
            Sanitize();
        }

        public abstract string PreviousProvider { get; set; }

        protected virtual void Sanitize()
        {
            throw new NotImplementedException();
        }

        public abstract string OptionType
        {
            get;
        }

    }
}
