using System;

namespace StreamEnergy.DomainModels.Enrollments.MarylandGas
{
    [Serializable]
    public abstract class OfferOption : IOfferOption
    {
        public const string Qualifier = "MarylandGas";

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
