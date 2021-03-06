﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class LoginResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public bool Success { get; set; }

        public string ReturnURI { get; set; }
    }
}