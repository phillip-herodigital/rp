using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Documents
{
    public interface IDocumentStore
    {
        Task<Guid> UploadNew(byte[] document, Guid customerId, string documentType, string mimeType);

        // TODO - access the document
    }
}
