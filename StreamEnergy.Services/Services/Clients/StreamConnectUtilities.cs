using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;

namespace StreamEnergy.Services.Clients
{
    class StreamConnectUtilities
    {
        public static dynamic ToStreamConnectAddress(Address addr)
        {
            dynamic serviceAddress = new
            {
                City = addr.City,
                State = addr.StateAbbreviation,
                StreetLine1 = addr.Line1,
                StreetLine2 = addr.Line2,
                Zip = addr.PostalCode5
            };
            return serviceAddress;
        }

        internal static object ToStreamConnectDeposit(DomainModels.Enrollments.OfferPayment offerPayment, bool waive)
        {
            if (offerPayment == null)
                return null;
            return new
            {
                Amount = offerPayment.RequiredAmounts.OfType<DomainModels.Enrollments.DepositOfferPaymentAmount>().FirstOrDefault().DollarAmount,
                IsWaived = waive,
            };
        }
    }
}
