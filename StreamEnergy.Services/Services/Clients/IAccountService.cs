﻿using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    public interface IAccountService
    {
        IEnumerable<Invoice> GetInvoices(string username);
    }
}