using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public interface IPaymentService
    {
        Task<IEnumerable<SavedPaymentInfo>> GetSavedPaymentMethods(Guid globalCustomerId);
        Task<Guid> SavePaymentMethod(Guid globalCustomerId, IPaymentInfo paymentInfo, string displayName);
        Task<bool> DeletePaymentMethod(Guid globalCustomerId, Guid paymentMethodId);
    }
}
