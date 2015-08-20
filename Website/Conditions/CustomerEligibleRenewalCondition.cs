using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Practices.Unity;
using Sitecore.Rules.Conditions;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Payments;

namespace StreamEnergy.MyStream.Conditions
{
    public class CustomerEligibleRenewalCondition<T> : WhenCondition<T>
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

            [Dependency]
            public IPaymentService paymentService { get; set; }
        }
        
        public CustomerEligibleRenewalCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public CustomerEligibleRenewalCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var result = AsyncHelper.RunSync<bool>(() => isEligibleReweal());

            return result;
        }

        public async Task<bool> isEligibleReweal()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;
            IPaymentService paymentService = dependencies.paymentService;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            if(currentUser.Accounts != null)
            {
                if(currentUser.Accounts.Count() == 1)
                {
                    var account = currentUser.Accounts.FirstOrDefault();
                    var accountDetails = await accountService.GetAccountDetails(account, false);
                    bool renewal = account.SubAccounts.Any(s => s.Capabilities.OfType<RenewalAccountCapability>().Any(c => c.IsEligible));
                    return renewal;
                }
                else
                {
                    return false;
                }
            }
            else
            { 
                return false;
            }
        }
    }
}