using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Services.Clients
{
    class HttpMessageSessionHeader : DelegatingHandler
    {
        private readonly IUnityContainer unityContainer;

        public HttpMessageSessionHeader(HttpMessageHandler innerHandler, IUnityContainer unityContainer)
            : base(innerHandler)
        {
            this.unityContainer = unityContainer;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            try
            {
                var context = unityContainer.Resolve<HttpContextBase>();

                if (context != null && context.Session != null)
                {
                    request.Headers.Add("X-User-Session-Id", context.Session.SessionID);
                }
            }
            catch { }
            return base.SendAsync(request, cancellationToken);
        }
    }
}
