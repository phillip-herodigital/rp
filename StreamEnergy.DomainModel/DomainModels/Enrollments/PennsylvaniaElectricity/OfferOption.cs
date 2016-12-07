using System;

namespace StreamEnergy.DomainModels.Enrollments.PennsylvaniaElectricity
{
    [Serializable]
    public abstract class OfferOption : IOfferOption
    {
        void ISanitizable.Sanitize()
        {
            Sanitize();
        }
        public const string Qualifier = "PennsylvaniaElectricity";

        public abstract string PreviousProvider { get; set; }

        protected virtual void Sanitize()
        {
            throw new NotImplementedException();
        }

        public abstract string OptionType { get; }
    }
}
