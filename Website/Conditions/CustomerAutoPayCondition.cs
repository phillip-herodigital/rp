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
            var result = AsyncHelper.RunSync<bool>(() => isAutoPay());

            return result;
        }

        public async Task<bool> isAutoPay()
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
                    var autoPayStatus = await paymentService.GetAutoPayStatus(account);
                    if (autoPayStatus.PaymentMethodId == Guid.Empty && !autoPayStatus.IsEnabled)
                    {
                        //Auto Pay diabled.
                        return false;
                    }
                    //Auto Pay enabled.
                    return true;
                }
                else
                {
                    //Bypass this condition if more than one account
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