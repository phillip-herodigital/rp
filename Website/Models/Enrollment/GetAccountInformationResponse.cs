using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class GetLoggedInUserInfoResponse
    {
        public IEnumerable<GetLoggedInAccountDetails> AccountDetails { get; set; }
        public bool IsUserLoggedIn { get; set; }
    }
}