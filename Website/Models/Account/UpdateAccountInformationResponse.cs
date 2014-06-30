﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public bool Success { get; set; }
    }
}