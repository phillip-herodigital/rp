using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.MyStream.Models.Authentication;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetOnlineAccountResponse
    {
        public string Username { get; set; }
        public DomainModels.Email Email { get; set; }
        public IEnumerable<SecurityQuestion> AvailableSecurityQuestions { get; set; }
        public IEnumerable<AnsweredSecurityQuestion> Challenges { get; set; }

    }
}