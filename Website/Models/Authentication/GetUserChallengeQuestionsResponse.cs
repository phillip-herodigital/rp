using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class GetUserChallengeQuestionsResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public string Username { get; set; }
        public IEnumerable<SecurityQuestion> SecurityQuestions { get; set; }

    }
}