using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Documents;

namespace StreamEnergy.Data.Documents
{
    class DocumentStore : IDocumentStore
    {
        public DocumentStore()
        {

        }

        public Task<Guid> UploadNew(byte[] document, Guid customerId, string documentType, string mimeType)
        {
            // TODO - upload the document somewhere
            return Task.FromResult(Guid.Empty);
        }

    }
}
