using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public interface IPaymentService
    {
        Task<PaymentResult> OneTimePayment(DateTime paymentDate, decimal amount, string streamAccountNumber, string customerName, string systemOfRecord, IPaymentInfo paymentAccount);
        Task<IEnumerable<SavedPaymentInfo>> GetSavedPaymentMethods(Guid globalCustomerId);
        Task<Guid> SavePaymentMethod(Guid globalCustomerId, IPaymentInfo paymentInfo, string displayName);
        Task<bool> DeletePaymentMethod(Guid globalCustomerId, Guid paymentMethodId);

        Task<IEnumerable<PastPayment>> PaymentHistory(Guid globalCustomerId);

        Task<AutoPaySetting> GetAutoPayStatus(Guid globalCustomerId, Guid globalAccountId);
        Task<bool> SetAutoPayStatus(Guid globalCustomerId, Guid globalAccountId, AutoPaySetting autoPaySetting);

    }
}
