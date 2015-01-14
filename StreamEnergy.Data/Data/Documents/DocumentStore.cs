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



        public Task<byte[]> Download(Guid documentId)
        {
            // TODO - download
            throw new NotImplementedException();
        }

        public Task<byte[]> DownloadByCustomer(Guid customerId, string documentType)
        {
            // TODO - download
            throw new NotImplementedException();
        }

        public Task<System.Net.Http.HttpResponseMessage> DownloadAsMessage(Guid documentId)
        {
            // TODO - download
            throw new NotImplementedException();
        }

        public Task<System.Net.Http.HttpResponseMessage> DownloadByCustomerAsMessage(Guid customerId, string documentType)
        {
            // TODO - download
            throw new NotImplementedException();
        }
    }
}
