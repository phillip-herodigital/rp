using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using System.Web.Security;
using Sitecore.Diagnostics;
using Sitecore.Data;
using Sitecore.Data.Items;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Accounts;
using System.Threading.Tasks;

namespace StreamEnergy.MyStream.Conditions
{
    public class CustomerAccountsCountCondition<T> : WhenCondition<T> 
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
        
        public CustomerAccountsCountCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public CustomerAccountsCountCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }
        
        public string Value
        {
            get;
            set;
        }

        protected override bool Execute(T ruleContext)
        {
            Assert.ArgumentNotNull(ruleContext, "ruleContext");

            var result = AsyncHelper.RunSync<bool>(() => hasAccountsCount());

            return result;
        }

        public async Task<bool> hasAccountsCount()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;
            string value = this.Value ?? string.Empty;
            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);

            return currentUser.Accounts.Count() == Convert.ToDouble(value);
        }

    }
}