
using StreamEnergy.MyStream.Models.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.MobileApp.models
{
    public class MobileAppResponse
    {
        public MobileAppUser User { get; set; }

        public IEnumerable<MobileAppAccount> Accounts { get; set; }
    }

    public class MobileAppUser {

        public string Name;

        public string UserName;

        public string Email;

        public IEnumerable<DomainModels.Payments.SavedPaymentRecord> PaymentMethods;
        public IEnumerable<StreamEnergy.MyStream.Models.Authentication.SecurityQuestion> AvailableSecurityQuestions { get; set; }
        public IEnumerable<StreamEnergy.MyStream.Models.Authentication.AnsweredSecurityQuestion> Challenges { get; set; }

    }
}