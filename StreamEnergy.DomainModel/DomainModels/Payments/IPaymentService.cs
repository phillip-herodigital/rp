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
        Task<PaymentResult> OneTimePayment(DateTime paymentDate, decimal amount, string customerName, Accounts.Account account, IPaymentInfo paymentAccount, string securityCode);
        Task<IEnumerable<SavedPaymentRecord>> GetSavedPaymentMethods(Guid globalCustomerId);
        Task<Guid> SavePaymentMethod(Guid globalCustomerId, IPaymentInfo paymentInfo, string displayName);
        Task<bool> DeletePaymentMethod(Guid globalCustomerId, Guid paymentMethodId);

        Task<IEnumerable<Account>> PaymentHistory(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects = null);

        Task<AutoPaySetting> GetAutoPayStatus(Accounts.Account account, bool forceRefresh = false);
        Task<bool> SetAutoPayStatus(Accounts.Account account, AutoPaySetting autoPaySetting);

        Task<bool> DetectDuplicatePayments(PaymentRecord[] paymentRecords);
        Task<bool> RecordForDuplicatePayments(PaymentRecord[] paymentRecords);
    }
}
