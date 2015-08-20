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
        private const string accountsList = "CurrentUser_Accounts";
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

        /*
        public override async Task<bool> Execute(T ruleContext)
        {
            bool result = await isPaperlessBilling();
            return result;
        }
        */

        protected override bool Execute(T ruleContext)
        {
            /*
            Task<bool[]> results = Task.WhenAll(isPaperlessBilling());
            if (results.Result.Count() > 0) {
                return results.Result[0];
            }
            */
            var result = AsyncHelper.RunSync<bool>(() => isPaperlessBilling());
            return result;
        }

        #region junk
        /*
            Task<bool> getResult = isPaperlessBilling();
            Task.WhenAll(getResult);
            bool r = getResult.Result;
            */

            /*
            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            var account = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
            var accountDetails = await accountService.GetAccountDetails(account, false);

            var accounts = HttpContext.Current.Session[accountsList] as IEnumerable<Account>;

            if (count == 1)
            {
                var account = currentUser.Accounts.FirstOrDefault();


                return true;
            }
            return false;

            //var isCustomerPaperlessBilling = !string.IsNullOrEmpty(dependencies.Settings.GetSettingsValue("Customer Has Paperless Billing", "Customer Has Paperless Billing"));
            //ICurrentUser currentUser = new MyStream.Controllers.ApiControllers.AccountController(null,HttpContext.Current.Session,null,null,null,null,null,null,null,null);
            //DomainModels.Accounts.IAccountService accountService;
            //bool isOne = await isCustomerHasOneAccount();

            //if (isOne)
            //{
            //    return true;
            //}
            //return true;
        }
            */
        #endregion

        public async Task<bool> isPaperlessBilling()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;
            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            if(currentUser.Accounts != null)
            {
                if(currentUser.Accounts.Count() == 1) {
                    var account = currentUser.Accounts.FirstOrDefault();
                    var accountDetails = await accountService.GetAccountDetails(account, false);

                    return true;
                } else {
                    return false;
                }
            } else { 
                return false;
            }
        }
    }
}