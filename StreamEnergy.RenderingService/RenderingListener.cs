using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace StreamEnergy.RenderingService
{
    class RenderingListener
    {
        private readonly Rasterizer rasterizer;
        private readonly string name;
        private readonly RedisQueueListener listener;
        private readonly Microsoft.WindowsAzure.Storage.Blob.CloudBlobClient azureStore;

        public RenderingListener(Rasterizer rasterizer, string name, StackExchange.Redis.IDatabase redisDb, Microsoft.WindowsAzure.Storage.CloudStorageAccount cloudStorageAccount)
        {
            this.rasterizer = rasterizer;
            this.name = name;
            listener = new RedisQueueListener(redisDb, name);
            azureStore = cloudStorageAccount.CreateCloudBlobClient();
        }

        internal async System.Threading.Tasks.Task SingleIteration(System.Threading.CancellationToken cancellationToken)
        {
            string value = await listener.Poll();
            bool succeeded = false;

            if (value != null)
            {
                if (!cancellationToken.IsCancellationRequested)
                {
                    try
                    {
                        byte[] pdf = rasterizer.RasterizeEnrollmentConfirmation(value);

                        var matches = Regex.Matches(value, "\"confirmationNumber\":\"([^\"]+)\"");
                        var confNumbers = from Match match in matches
                                          select match.Groups[1].Value;

                        // container names must be lower-case.
                        var container = azureStore.GetContainerReference(("EnrollmentScreenshots-" + DateTime.Now.Year + "-" + DateTime.Now.Month.ToString("00")).ToLower());
                        await container.CreateIfNotExistsAsync();

                        var blockBlob = container.GetBlockBlobReference(string.Join("_", confNumbers) + "_" + DateTime.Now.ToString("yyyyMMddhhmmss"));
                        await blockBlob.UploadFromByteArrayAsync(pdf, 0, pdf.Length);

                        succeeded = true;
                    }
                    catch
                    {
                    }
                }

                if (!succeeded)
                {
                    await listener.Enqueue(value);
                }
            }
        }
    }
}
