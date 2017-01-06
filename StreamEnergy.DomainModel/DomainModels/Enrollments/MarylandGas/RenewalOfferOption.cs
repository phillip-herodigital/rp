﻿using System;

namespace StreamEnergy.DomainModels.Enrollments.MarylandGas
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "MarylandGasRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}