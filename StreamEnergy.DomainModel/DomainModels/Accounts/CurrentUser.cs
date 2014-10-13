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
        private readonly Func<HttpContextBase> contextLocator;
        private readonly UserProfileLocator profileLocator;

        public CurrentUser(Func<HttpContextBase> contextLocator, UserProfileLocator profileLocator)
        {
            this.contextLocator = contextLocator;
            this.profileLocator = profileLocator;
        }

        Guid ICurrentUser.StreamConnectCustomerId
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

        IEnumerable<Account> ICurrentUser.Accounts
        {
            get
            {
                var gcid = profileLocator.Locate(contextLocator().User.Identity.Name).GlobalCustomerId;


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
