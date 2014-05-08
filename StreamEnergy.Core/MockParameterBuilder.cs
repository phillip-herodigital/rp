using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy
{
    public class MockParameterBuilder
    {
        private readonly IUnityContainer container;

        public MockParameterBuilder(IUnityContainer container)
        {
            this.container = container;
        }

        public string[] Build()
        {
            var context = container.Resolve<HttpContextBase>();
            var query = HttpUtility.ParseQueryString(context.Request.Url.Query);
            if (context.Request.UrlReferrer != null)
                query.Add(HttpUtility.ParseQueryString(context.Request.UrlReferrer.Query));

            return query.GetValues("mock") ?? new string[0];
        }
    }
}
