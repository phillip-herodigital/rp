using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class VerifySecurityQuestionsRequest
    {
        public Dictionary<Guid, string> Answers { get; set; }
    }
}