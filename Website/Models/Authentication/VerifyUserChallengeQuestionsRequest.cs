﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class VerifyUserChallengeQuestionsRequest
    {
        public Dictionary<Guid, string> Answers { get; set; }
    }
}