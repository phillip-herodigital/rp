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

        [ColumnSchema("Invoice Number", DeviceType.Tablet, DeviceType.Phone)]
        public string InvoiceAmount { get; set; }

        [ColumnSchema("Due Date", DeviceType.Tablet, DeviceType.Phone)]
        public string DueDate { get; set; }

        public decimal AccountBalance { get; set; }

        public bool CanMakeOneTimePayment { get; set; }

        public DomainModels.Accounts.AvailablePaymentMethod[] AvailablePaymentMethods { get; set; }

        public string UtilityProvider { get; set; }

        [ColumnSchema("Details")]
        public Dictionary<string, string> Actions { get; private set; }

    }
}
