﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace StreamEnergy.Interpreters
{
    public interface IDpiEnrollmentParameters
    {
        void Initialize(System.Collections.Specialized.NameValueCollection queryString);

        string AccountType { get; }

        string ServiceType { get; }

        string State { get; }

        string AccountNumber { get; }

        string GroupId { get; }

        string RefSite { get; }

        Func<string> GetTargetDpiUrlBuilder();

        JObject ToStreamConnectSalesInfo();
    }
}
