using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    public interface IW9GenerationService
    {
        byte[] GenerateW9(string name, string businessName, W9BusinessClassification businessType, string businessTypeAdditional, string exemptPayeeCode, string fatcaExemtionCode, Address address, string currentAccountNumbers, string socialSecurityNumber, string employerIdentificationNumber, byte[] signature, DateTime date);
    }
}
