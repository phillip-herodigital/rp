using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    interface IPdfGenerationService
    {
        byte[] GenerateW9(string name, string businessName, PdfBusinessTypes businessType, string businessTypeAdditional, bool isExempt, string address, string city, string state, string zip, string socialSecurityNumber, string employerIdentificationNumber, byte[] signature, DateTime date);
    }
}
