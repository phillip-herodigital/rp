using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.DomainModels.Accounts
{
    class CurrentUser : ICurrentUser
    {
        private const string accountsList = "CurrentUser_Accounts";
        private const string customerKey = "CurrentUser_Customer";
        private readonly Func<HttpContextBase> contextLocator;
        private readonly UserProfileLocator profileLocator;

        public CurrentUser(Func<HttpContextBase> contextLocator, UserProfileLocator profileLocator)
        {
            this.contextLocator = contextLocator;
            this.profileLocator = profileLocator;
        }

        public Guid StreamConnectCustomerId
        {
            get 
            {
                var username = contextLocator().User.Identity.Name;
                if (username.StartsWith(ImpersonationUtility.DomainPrefix))
                {
                    return new Guid(username.Substring(ImpersonationUtility.DomainPrefix.Length));
                }
                return profileLocator.Locate(username).GlobalCustomerId; 
            }
        }

        Customer ICurrentUser.Customer
        {
            get
            {
                var gcid = StreamConnectCustomerId;


                var customer = contextLocator().Session[customerKey] as Customer;
                if (customer != null)
                    return customer;

                return null;
            }
            set
            {
                contextLocator().Session[customerKey] = value;
            }
        }

        IEnumerable<Account> ICurrentUser.Accounts
        {
            get
            {
                var gcid = StreamConnectCustomerId;


                var accounts = contextLocator().Session[accountsList] as IEnumerable<Account>;
                if (accounts != null && accounts.All(acct => acct.StreamConnectCustomerId == gcid))
                    return accounts;

                return null;
            }
            set
            {
                contextLocator().Session[accountsList] = value.ToArray();
            }
        }
    }
}
