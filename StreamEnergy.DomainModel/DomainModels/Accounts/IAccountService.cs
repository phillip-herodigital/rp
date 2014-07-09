﻿using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public interface IAccountService
    {
        IEnumerable<Account> GetInvoices(string username);
        Task<IEnumerable<Account>> GetCurrentInvoices(string username);
        Task<MakePaymentResult> MakePayment(string account, decimal amount, Payments.IPaymentInfo paymentMethod);

        string GetIgniteAssociateFromCustomerNumber(string Auth_ID, string Auth_PW, string customerNumber);

        Legacy.CustomerAccount RetrieveIgniteAssociateContactInfo(string Auth_ID, string Auth_PW, string IA_Number);

        Legacy.CustomerAccount GetCisAccountsByUtilityAccountNumber(string utilityAccountNumber, string customerPin, string cisOfRecord);

        Legacy.CustomerAccount GetCisAccountsByCisAccountNumber(string cisAccountNumber, string customerPin, string cisOfRecord);

    }
}
