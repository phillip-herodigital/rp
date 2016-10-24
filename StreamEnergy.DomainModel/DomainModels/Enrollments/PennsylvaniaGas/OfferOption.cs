﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.PennsylvaniaGas
{
    [Serializable]
    public abstract class OfferOption : IOfferOption
    {
        public const string Qualifier = "PennsylvaniaGas";

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
