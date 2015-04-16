using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Activation
{
    public interface IActivationCodeLookup
    {
        Task<string> LookupEsn(string activationCode);
        Task<bool> UploadCsv(string csv);
    }
}
