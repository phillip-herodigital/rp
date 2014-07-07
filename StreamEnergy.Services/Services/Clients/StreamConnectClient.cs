using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services.Clients
{
    public class StreamConnectClient
    {
        public StreamConnectClient([Dependency(StreamConnectContainerSetup.StreamConnectKey)] Uri streamConnectBaseUri, AzureAccessControlServiceTokenManager tokenManager)
        {

        }
    }
}
