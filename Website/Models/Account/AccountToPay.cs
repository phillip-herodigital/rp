using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.MyStream.Models.Angular.GridTable;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountToPay
    {
        public AccountToPay()
        {
            Actions = new Dictionary<string, string>();
        }

        [ColumnSchema("Account Number", DeviceType.Phone)]
        public string AccountNumber { get; set; }

        [ColumnSchema("Amount Due")]
        public decimal AmountDue { get; set; }

        [ColumnSchema("Due Date")]
        public DateTime DueDate { get; set; }

        public bool CanMakeOneTimePayment { get; set; }

        public DomainModels.Accounts.AvailablePaymentMethod[] AvailablePaymentMethods { get; set; }

        public string UtilityProvider { get; set; }

        [ColumnSchema("Action", DeviceType.Tablet, DeviceType.Phone)]
        public Dictionary<string, string> Actions { get; private set; }

    }
}
