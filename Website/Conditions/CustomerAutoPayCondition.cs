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
    public class CustomerAutoPayCondition<T> : WhenCondition<T>
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
        
        public CustomerAutoPayCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public CustomerAutoPayCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var result = AsyncHelper.RunSync<bool>(() => isEligibleAutoPay());

            return result;
        }

        public async Task<bool> isEligibleAutoPay()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;
            IPaymentService paymentService = dependencies.paymentService;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            if (currentUser.Accounts != null && currentUser.Accounts.Count() == 1)
            {
                var account = currentUser.Accounts.FirstOrDefault();
                var autoPayStatus = await paymentService.GetAutoPayStatus(account);
                return !autoPayStatus.IsEnabled;
            }
            else
            { 
                return true;
            }
        }
    }
}