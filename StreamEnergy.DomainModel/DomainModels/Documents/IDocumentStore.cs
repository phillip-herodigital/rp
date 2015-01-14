using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Documents
{
    public interface IDocumentStore
    {
        Task<Guid> UploadNew(byte[] document, Guid customerId, string documentType, string mimeType);

        // update document? 
        // delete document?

        Task<byte[]> Download(Guid documentId);
        Task<byte[]> DownloadByCustomer(Guid customerId, string documentType);
        Task<HttpResponseMessage> DownloadAsMessage(Guid documentId);
        Task<HttpResponseMessage> DownloadByCustomerAsMessage(Guid customerId, string documentType);
    }
}
