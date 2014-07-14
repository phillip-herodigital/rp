using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.DomainModels
{
    class AccountLookup : ITypeIndicatorLookup
    {
        private Dictionary<string, Type> subAccountTypeLookup;

        public AccountLookup(Dictionary<string, Type> dictionary)
        {
            this.subAccountTypeLookup = dictionary;
        }

        public Type SuperType
        {
            get { return typeof(Account); }
        }

        public Type FindMatch(Newtonsoft.Json.Linq.JObject data)
        {
            if (data["accountType"] != null && subAccountTypeLookup.ContainsKey(data["accountType"].ToString()))
                return typeof(Account<>).MakeGenericType(subAccountTypeLookup[data["accountType"].ToString()]);
            return typeof(Account);
        }
    }
}
