using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using StreamEnergy.DomainModels.Documents;
using StreamEnergy.Extensions;

namespace StreamEnergy.Data.Documents
{
    class DocumentStore : IDocumentStore
    {
        public const string SqlConnectionString = "DocumentStore.ConnectionString";
        public const string CloudStorageContainerFormat = "DocumentStore.CloudStorageContainerFormat";
        private readonly string cloudStorageContainerFormat;
        private readonly string sqlConnectionString;
        private readonly CloudBlobClient azureStore;

        private class DocumentStoreRecord
        {
            public Guid Id;
            public string ContainerName;
            public string BlobName;
            public Guid CustomerId;
            public string SystemOfRecordId;
            public string DocumentType;
            public string MimeType;
        }

        public DocumentStore(CloudStorageAccount cloudStorageAccount, [Dependency(CloudStorageContainerFormat)] string cloudStorageContainerFormat, 
            [Dependency(SqlConnectionString)] string sqlConnectionString)
        {
            azureStore = cloudStorageAccount.CreateCloudBlobClient();
            this.cloudStorageContainerFormat = cloudStorageContainerFormat;
            this.sqlConnectionString = sqlConnectionString;
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(this.sqlConnectionString);
        }

        private CloudBlobContainer GetNewContainer()
        {
            var container = azureStore.GetContainerReference(cloudStorageContainerFormat.Format(new { year = DateTime.Now.Year, month = DateTime.Now.Month.ToString("00") }).ToLower());
            return container;
        }

        public async Task<Guid> UploadNew(byte[] document, Guid customerId, string systemOfRecordId, string documentType, string mimeType)
        {
            Guid documentId = Guid.NewGuid();

            var container = GetNewContainer();
            var containerName = container.Name;
            var blobName = documentId.ToString() + "_" + DateTime.Now.ToString("yyyyMMddhhmmss");
            var blockBlob = container.GetBlockBlobReference(blobName);
            await blockBlob.UploadFromByteArrayAsync(document, 0, document.Length);

            using (var connection = CreateConnection())
            using (var cmd = new SqlCommand(@"
INSERT INTO DocumentStore
    (
        Id,
        ContainerName,
        BlobName,
        CustomerId,
        SystemOfRecordId,
        DocumentType,
        MimeType
    ) 
VALUES
    (
        @id,
        @containerName,
        @blobName,
        @customerId,
        @systemOfRecordId,
        @documentType,
        @mimeType
    )", connection))
            {
                await connection.OpenAsync();

                cmd.Parameters.Add(new SqlParameter("@id", documentId));
                cmd.Parameters.Add(new SqlParameter("@containerName", containerName));
                cmd.Parameters.Add(new SqlParameter("@blobName", blobName));
                cmd.Parameters.Add(new SqlParameter("@customerId", customerId));
                cmd.Parameters.Add(new SqlParameter("@systemOfRecordId", systemOfRecordId));
                cmd.Parameters.Add(new SqlParameter("@documentType", documentType));
                cmd.Parameters.Add(new SqlParameter("@mimeType", mimeType));

                await cmd.ExecuteNonQueryAsync();
            }

            return documentId;
        }

        public Task<Stream> Download(Guid documentId)
        {
            return FindDocument(documentId).ContinueWith(t => GetBytes(t.Result)).Unwrap();
        }

        public Task<Stream> DownloadByCustomer(Guid customerId, string documentType)
        {
            return FindDocument(customerId, documentType).ContinueWith(t => GetBytes(t.Result)).Unwrap();
        }

        public Task<System.Net.Http.HttpResponseMessage> DownloadAsMessage(Guid documentId)
        {
            return FindDocument(documentId).ContinueWith(t => GetMessage(t.Result)).Unwrap();
        }

        public Task<System.Net.Http.HttpResponseMessage> DownloadByCustomerAsMessage(Guid customerId, string documentType)
        {
            return FindDocument(customerId, documentType).ContinueWith(t => GetMessage(t.Result)).Unwrap();
        }

        private async Task<DocumentStoreRecord> FindDocument(Guid documentId)
        {
            using (var connection = CreateConnection())
            using (var cmd = new SqlCommand(@"
SELECT Id,
       ContainerName,
       BlobName,
       CustomerId,
       SystemOfRecordId,
       DocumentType,
       MimeType
FROM DocumentStore
WHERE Id = @id", connection))
            {
                await connection.OpenAsync();

                cmd.Parameters.Add(new SqlParameter("@id", documentId));

                return await ReadSingleRecord(cmd);
            }
        }

        private async Task<DocumentStoreRecord> FindDocument(Guid customerId, string documentType)
        {
            using (var connection = CreateConnection())
            using (var cmd = new SqlCommand(@"
SELECT Id,
       ContainerName,
       BlobName,
       CustomerId,
       SystemOfRecordId,
       DocumentType,
       MimeType
FROM DocumentStore
WHERE CustomerId = @customerId AND DocumentType = @documentType", connection))
            {
                await connection.OpenAsync();

                cmd.Parameters.Add(new SqlParameter("@customerId", customerId));
                cmd.Parameters.Add(new SqlParameter("@documentType", documentType));

                return await ReadSingleRecord(cmd);
            }
        }

        private async Task<DocumentStoreRecord> ReadSingleRecord(SqlCommand cmd)
        {
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                if (await reader.ReadAsync())
                {
                    return new DocumentStoreRecord
                    {
                        Id = (Guid)reader["Id"],
                        ContainerName = (string)reader["ContainerName"],
                        BlobName = (string)reader["BlobName"],
                        CustomerId = (Guid)reader["CustomerId"],
                        SystemOfRecordId = (string)reader["SystemOfRecordId"],
                        DocumentType = (string)reader["DocumentType"],
                        MimeType = (string)reader["MimeType"],
                    };
                }
                return null;
            }
        }

        private async Task<Stream> GetBytes(DocumentStoreRecord documentStoreRecord)
        {
            var container = azureStore.GetContainerReference(documentStoreRecord.ContainerName);
            var blob = container.GetBlockBlobReference(documentStoreRecord.BlobName);

            return await blob.OpenReadAsync();
        }

        private async Task<System.Net.Http.HttpResponseMessage> GetMessage(DocumentStoreRecord documentStoreRecord)
        {
            var bytes = await GetBytes(documentStoreRecord);

            return new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = new System.Net.Http.StreamContent(bytes)
                {
                    Headers =
                        {
                            ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(documentStoreRecord.MimeType)
                        }
                }
            };
        }
    }
}
