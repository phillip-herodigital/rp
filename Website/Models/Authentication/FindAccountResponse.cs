using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class FindAccountResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }
        
        public DomainModels.CustomerContact Customer { get; set; }
        public DomainModels.Address Address { get; set; }

        public string AccountNumber { get; set; }
        public string SsnLastFour { get; set; }

        public IEnumerable<SecurityQuestion> AvailableSecurityQuestions { get; set; }

    }
}