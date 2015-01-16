using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IInitialPaymentAmount : IOfferPaymentAmount
    {
        string SystemOfRecord { get; }
        string DepositAccount { get; }
    }
}
