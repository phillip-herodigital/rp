﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public abstract class OfferOption : IOfferOption
    {
        void ISanitizable.Sanitize()
        {
            Sanitize();
        }
        public const string Qualifier = "NewYorkGas";

        public abstract string PreviousProvider { get; set; }

        protected virtual void Sanitize()
        {
            throw new NotImplementedException();
        }

        public abstract string OptionType { get; }
    }
}
