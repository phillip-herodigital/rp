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
    public class ElectricityAccountCondition<T> : WhenCondition<T>
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
        
        public ElectricityAccountCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public ElectricityAccountCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var result = AsyncHelper.RunSync<bool>(() => hasElectricityAccount());

            return result;
        }

        public async Task<bool> hasElectricityAccount()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            if (currentUser.Accounts != null)
            {
                return currentUser.Accounts.Where(a => a.SystemOfRecord == "CIS1").Any();
            }
            else
            { 
                return false;
            }
        }
    }
}