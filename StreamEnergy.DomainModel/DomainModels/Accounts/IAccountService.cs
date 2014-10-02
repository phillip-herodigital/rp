using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public interface IAccountService
    {
        Task<IEnumerable<Account>> GetInvoices(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects = null);
        Task<IEnumerable<Account>> GetCurrentInvoices(Guid globalCustomerId);
        Task<Uri> GetInvoicePdf(Account account, Invoice invoice);
        Task<IEnumerable<Account>> GetAccountBalances(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects = null, bool forceRefresh = false);
        Task<Account> GetCurrentInvoice(string accountNumber);

        string GetIgniteAssociateFromCustomerNumber(string Auth_ID, string Auth_PW, string customerNumber);

        Legacy.CustomerAccount RetrieveIgniteAssociateContactInfo(string Auth_ID, string Auth_PW, string IA_Number);

        Legacy.CustomerAccount GetCisAccountsByUtilityAccountNumber(string utilityAccountNumber, string customerPin, string cisOfRecord);

        Legacy.CustomerAccount GetCisAccountsByCisAccountNumber(string cisAccountNumber, string customerPin, string cisOfRecord);



        Task<Guid> CreateStreamConnectCustomer(string portalId = null, string email = null);

        Task<string> GetEmailByCustomerId(Guid globalCustomerId);

        Task<IEnumerable<Account>> GetAccounts(Guid globalCustomerId);
        Task<Account> AssociateAccount(Guid globalCustomerId, string accountNumber, string ssnLast4, string accountNickname);
        Task<bool> DisassociateAccount(Account account);
        Task<bool> GetAccountDetails(Account account, bool forceRefresh = false);
        Task<Account> GetAccountDetails(string accountNumber);

        Task<bool> SetAccountDetails(Account acct, AccountDetails accountDetails);
    }
}
