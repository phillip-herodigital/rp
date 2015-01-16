using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Documents
{
    public interface IDocumentStore
    {
        Task<Guid> UploadNew(byte[] document, Guid customerId, string systemOfRecordId, string documentType, string mimeType);

        // update document? 
        // delete document?

        Task<Stream> Download(Guid documentId);
        Task<Stream> DownloadByCustomer(Guid customerId, string documentType);
        Task<HttpResponseMessage> DownloadAsMessage(Guid documentId);
        Task<HttpResponseMessage> DownloadByCustomerAsMessage(Guid customerId, string documentType);
    }
}
