using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace StreamEnergy.LuceneServices.Web.Tests
{
    public class ContainerSetup
    {
        public static Container Create()
        {
            var result = new Container(new Microsoft.Practices.Unity.UnityContainer());
            var configuration = WebConfigurationManager.GetWebApplicationSection("streamEnergy") as Configuration.ConfigurationSection;

            result.Initialize((from iocInitializer in configuration.InversionOfControlInitializers
                               let value = iocInitializer.Build()
                               where value != null
                               select value).ToArray());
            return result;
        }
    }
}
