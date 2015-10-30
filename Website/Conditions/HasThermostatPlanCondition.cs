using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Rules.Conditions;
using Microsoft.Practices.Unity;
using StreamEnergy.StreamEnergyBilling.IstaTokenization;
using System.Collections.Specialized;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;
using StreamEnergy.DomainModels.Accounts;
using System.Threading.Tasks;
using Sitecore.Data.Items;

namespace StreamEnergy.MyStream.Conditions
{
    public class HasThermostatPlanCondition<T> : WhenCondition<T>
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

        public HasThermostatPlanCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }
        public HasThermostatPlanCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var result = AsyncHelper.RunSync<bool>(() => hasAdditionalThermostat());
            return result;
        }

        private bool AccountIncludesThermostat(ISubAccount account)
        {
            try
            {
                if (!(account is TexasElectricityAccount))
                    return false;
                return ((TexasElectricityAccount)account).IncludesThermostat;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> hasAdditionalThermostat()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);

            if (currentUser.Accounts != null && currentUser.Accounts.Count() > 0)
            {
                try
                {
                    foreach (Account account in currentUser.Accounts)
                    {
                        var accountDetails = await accountService.GetAccountDetails(account);

                        if(account.SubAccounts.Any(a => AccountIncludesThermostat(a)))
                        {
                            return true;
                        }
                    }
                    return false;
                }
                catch (Exception)
                {
                    return false;
                }
            }
            return false;
        }
    }
}