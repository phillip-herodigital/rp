﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class EnrolledAccount
    {
        public string AccountNumber { get; set; }
        public DateTime DateAdded { get; set; }
        public bool SendLetter { get; set; }
    }
}