﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class NewYorkGasAccount : ISubAccount
    {
        public const string Qualifier = "NewYorkGas";

        public const string Classification = "Utility";

        public NewYorkGasAccount()
        {
            Capabilities = new List<ISubAccountCapability>();
        }

        public string Id { get; set; }
        public IList<ISubAccountCapability> Capabilities { get; private set; }

        [Required(ErrorMessage = "Service Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Service Address ")]
        public Address ServiceAddress { get; set; }
        public Enrollments.EnrollmentCustomerType CustomerType { get; set; }
        public string ProductType { get { return "Gas"; } }
        public string ProviderId { get; set; }

        public RateType RateType { get; set; }
        public decimal Rate { get; set; }
        public int TermMonths { get; set; }
        public string ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }

        public string EarlyTerminationFee { get; set; }
        public bool IncludesThermostat { get; set; }
        public bool IncludesSkydrop { get; set; }
        void ISanitizable.Sanitize()
        {
            if (ServiceAddress != null)
                ((ISanitizable)ServiceAddress).Sanitize();
        }

        public string SubAccountType
        {
            get { return NewYorkGasAccount.Qualifier; }
        }

        public string Key
        {
            get { return NewYorkGasAccount.Classification; }
        }

    }
}
