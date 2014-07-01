using StreamEnergy.MyStream.Models.Angular.GridTable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class Payment
    {
        public Payment()
        {
            Actions = new Dictionary<string, string>();
        }

        [ColumnSchema("Recurring")]
        public bool IsRecurring { get; set; }

        [ColumnSchema("Account Number", DeviceType.Phone)]
        public string AccountNumber { get; set; }

        [ColumnSchema("Service Type")]
        public string ServiceType { get; set; }

        [ColumnSchema("Confirm Code", DeviceType.Tablet, DeviceType.Phone)]
        public string ConfirmCode { get; set; }

        [ColumnSchema("Payment Amount")]
        public string PaymentAmount { get; set; }

        [ColumnSchema("Payment Date", DeviceType.Tablet, DeviceType.Phone)]
        public string PaymentDate { get; set; }

        [ColumnSchema("Status", DeviceType.Tablet, DeviceType.Phone)]
        public string Status { get; set; }

        [ColumnSchema("Action")]
        public Dictionary<string, string> Actions { get; private set; }

        public string PaymentID { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentAccount { get; set; }
        public string RoutingNumber { get; set; }
        public string PaymentMadeBy { get; set; }
    }
}