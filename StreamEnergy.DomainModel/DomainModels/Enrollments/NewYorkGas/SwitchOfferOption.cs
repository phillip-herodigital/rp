﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public class SwitchOfferOption : OfferOption
    {
        public new const string Qualifier = "NewYorkGasSwitch";
        
        public override string OptionType
        {
            get { return SwitchOfferOption.Qualifier; }
        }

        [Required]
        public string LUAN { get; set; }

        public override string PreviousProvider { get; set; }

        protected override void Sanitize()
        {
            if (!string.IsNullOrEmpty(LUAN))
            {
                LUAN = LUAN.Trim();
            }
            base.Sanitize();
        }


    }
}
