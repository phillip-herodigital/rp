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
            var result = AsyncHelper.RunSync<bool>(() => isEligibleRenewal());

            return result;
        }

        public async Task<bool> isEligibleRenewal()
        {
            ICurrentUser currentUser = dependencies.currentUser;
            IAccountService accountService = dependencies.accountService;
            IPaymentService paymentService = dependencies.paymentService;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            if (currentUser.Accounts != null && currentUser.Accounts.Where(a => a.AccountType == "Utility").Count() == 1)
            {
                var account = currentUser.Accounts.Where(a => a.AccountType == "Utility").FirstOrDefault();
                var accountDetails = await accountService.GetAccountDetails(account, false);

                var exclude = account != null && ExcludeProducts(account.SubAccounts);

                if (exclude)
                    return false;

                return account.SubAccounts.Any(s => s.Capabilities.OfType<RenewalAccountCapability>().Any(c => c.IsEligible));
            }

            return false;
        }

        private bool ExcludeProducts(ISubAccount[] accounts)
        {
            List<Sitecore.Data.Items.Item> products = Sitecore.Context.Database.GetItem("{0302C34C-EC0F-41B4-BE4F-AD9A28868604}").Children.ToList(); // /sitecore/content/Data/Taxonomy/Excluded Renewal Products
            string productCode = null;

            foreach (var subAccount in accounts)
            {
                if (subAccount is TexasElectricityAccount)
                    productCode = ((TexasElectricityAccount)subAccount).ProductCode;
                else if (subAccount is NewJerseyElectricityAccount)
                    productCode = ((NewJerseyElectricityAccount)subAccount).ProductCode;
                else if (subAccount is NewYorkElectricityAccount)
                    productCode = ((NewYorkElectricityAccount)subAccount).ProductCode;
                else if (subAccount is GeorgiaGasAccount)
                    productCode = ((GeorgiaGasAccount)subAccount).ProductCode;
                else if (subAccount is NewJerseyGasAccount)
                    productCode = ((NewJerseyGasAccount)subAccount).ProductCode;
                else if (subAccount is NewYorkGasAccount)
                    productCode = ((NewYorkGasAccount)subAccount).ProductCode;
                else if (subAccount is PennsylvaniaElectricityAccount)
                    productCode = ((PennsylvaniaElectricityAccount)subAccount).ProductCode;
                else if (subAccount is PennsylvaniaGasAccount)
                    productCode = ((PennsylvaniaGasAccount)subAccount).ProductCode;
                else if (subAccount is DCElectricityAccount)
                    productCode = ((DCElectricityAccount)subAccount).ProductCode;
                else if (subAccount is MarylandElectricityAccount)
                    productCode = ((MarylandElectricityAccount)subAccount).ProductCode;
                else if (subAccount is MarylandGasAccount)
                    productCode = ((MarylandGasAccount)subAccount).ProductCode;
                if (products.Any(a => a.Name == productCode))
                    return true;
            }

            return false;
        }
    }
}