﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class AccountSummary
    {
        public AccountSummary(Account Account)
        {
            StreamConnectAccountId = Account.StreamConnectAccountId;
            AccountNumber = Account.AccountNumber;
            AccountType = Account.AccountType;
            SystemOfRecord = Account.SystemOfRecord;
            Balance = Account.Balance;
            SubAccounts = Account.SubAccounts;
        }

        public Guid StreamConnectAccountId { get; private set; }
        public string AccountNumber { get; set; }
        public string AccountType { get; set; }
        public string SystemOfRecord { get; set; }
        public AccountBalance Balance { get; set; }
        public ISubAccount[] SubAccounts { get; set; }
    }
}
