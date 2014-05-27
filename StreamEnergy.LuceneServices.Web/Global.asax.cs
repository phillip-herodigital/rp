using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace StreamEnergy.LuceneServices.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            App_Start.UnityConfig.RegisterComponents();
            GlobalConfiguration.Configure(App_Start.WebApiConfig.Register);
        }
    }
}
