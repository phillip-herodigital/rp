using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.Services.Clients
{
    class AccountFactory
    {
        public struct AccountKey
        {
            public Guid StreamConnectCustomerId;
            public Guid StreamConnectAccountId;
            public string AccountNumber;
            public string AccountType;
            public string SystemOfRecord;
        }

        public Account LocateAccount(IEnumerable<Account> accounts, Guid accountId)
        {
            return accounts.FirstOrDefault(acct => acct.StreamConnectAccountId == accountId);
        }

        public IEnumerable<Account> Merge<T>(IEnumerable<Account> accounts, IEnumerable<IGrouping<AccountKey, T>> dataToMerge, Action<Account, IEnumerable<T>> apply)
        {
            var result = new List<Account>(accounts ?? Enumerable.Empty<Account>());
            foreach (var data in dataToMerge)
            {
                var account = LocateAccount(result, data.Key.StreamConnectAccountId);
                if (account == null)
                {
                    account = CreateAccount(data.Key);
                    result.Add(account);
                }

                apply(account, data);
            }
            return result.ToArray();
        }

        public Account CreateAccount(AccountKey accountKey)
        {
            // TODO - typed account
            return new Account(accountKey.StreamConnectCustomerId, accountKey.StreamConnectAccountId)
                    {
                        AccountNumber = accountKey.AccountNumber,
                        AccountType = accountKey.AccountType,
                        SystemOfRecord = accountKey.SystemOfRecord
                    };
        }
    }
}
