using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Configuration
{
    class IocInitializer : System.Configuration.ConfigurationElement
    {
        internal class KeyGenerator : IKeyGenerator<IocInitializer>
        {
            object IKeyGenerator<IocInitializer>.GetKey(IocInitializer element)
            {
                return element.TypeName;
            }
        }


        [System.Configuration.ConfigurationProperty("type", IsRequired = true)]
        public string TypeName
        {
            get
            {
                return (string)base["type"];
            }
            set
            {
                base["type"] = value;
            }
        }

        public Unity.IContainerSetupStrategy Build()
        {
            try
            {
                var type = Type.GetType(TypeName);
                return Activator.CreateInstance(type) as Unity.IContainerSetupStrategy;
            }
            catch (Exception ex)
            {
                global::Sitecore.Diagnostics.Log.Error("Could not build Unity.IContainerSetupStrategy of type " + TypeName, ex, this);
                return null;
            }
        }
    }
}
