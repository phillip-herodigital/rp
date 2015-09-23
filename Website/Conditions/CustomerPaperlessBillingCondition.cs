using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Practices.Unity;
using Sitecore.Rules.Conditions;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.MyStream.Conditions
{
    public class CustomerPaperlessBillingCondition<T> : WhenCondition<T>
        where T : Sitecore.Rules.RuleContext
    {
        private readonly Injection dependencies;

        public class Injection
        {
            [Dependency]
            public ISettings Settings { get; set; }

            [Dependency]
            public ICurrentUser currentUser { get; set; }

            [Dependency]
            public IAccountService accountService { get; set; }
        }
        
        public CustomerPaperlessBillingCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public CustomerPaperlessBillingCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var result = AsyncHelper.RunSync<bool>(() => isEligiblePaperless());

            return result;
        }

        public async Task<bool> isEligiblePaperless()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            if (currentUser.Accounts != null && currentUser.Accounts.Count() == 1)
            {
                var account = currentUser.Accounts.FirstOrDefault();
                var accountDetails = await accountService.GetAccountDetails(account, false);
                return account.Details.BillingDeliveryPreference != "Email";
            }
            else
            { 
                return false;
            }
        }
    }
}