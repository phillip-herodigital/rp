using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class VerifyUserChallengeQuestionsResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public string AccountName { get; set; }

        public bool Success { get; set; }
    }
}