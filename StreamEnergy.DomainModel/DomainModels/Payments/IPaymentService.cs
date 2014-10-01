using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.DomainModels.Payments
{
    public interface IPaymentService
    {
        Task<PaymentResult> OneTimePayment(DateTime paymentDate, decimal amount, string streamAccountNumber, string customerName, string systemOfRecord, IPaymentInfo paymentAccount);
        Task<IEnumerable<SavedPaymentInfo>> GetSavedPaymentMethods(Guid globalCustomerId);
        Task<Guid> SavePaymentMethod(Guid globalCustomerId, IPaymentInfo paymentInfo, string displayName);
        Task<bool> DeletePaymentMethod(Guid globalCustomerId, Guid paymentMethodId);

        Task<IEnumerable<Account>> PaymentHistory(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects = null);

        Task<AutoPaySetting> GetAutoPayStatus(Accounts.Account account);
        Task<bool> SetAutoPayStatus(Accounts.Account account, AutoPaySetting autoPaySetting);

    }
}
