using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.RenderingService
{
    class RenderingListener
    {
        private readonly Rasterizer rasterizer;
        private readonly string name;
        private readonly RedisQueueListener listener;
        private readonly Microsoft.WindowsAzure.Storage.File.CloudFileDirectory azureDir;

        public RenderingListener(Rasterizer rasterizer, string name, StackExchange.Redis.IDatabase redisDb, Microsoft.WindowsAzure.Storage.CloudStorageAccount cloudStorageAccount)
        {
            this.rasterizer = rasterizer;
            this.name = name;
            listener = new RedisQueueListener(redisDb, name);
            var azureStore = cloudStorageAccount.CreateCloudFileClient().GetShareReference("StreamEnergy");
            azureStore.CreateIfNotExists();
            azureDir = azureStore.GetRootDirectoryReference();
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

                        var azureSubDir = azureDir.GetDirectoryReference(name + "/" + DateTime.Now.Year + "/" + DateTime.Now.Month.ToString("00") + "/" + DateTime.Now.Day.ToString("00"));
                        azureDir.CreateIfNotExists();

                        var fileReference = azureDir.GetFileReference(Guid.NewGuid().ToString() + ".pdf");
                        await fileReference.UploadFromByteArrayAsync(pdf, 0, 0);

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
