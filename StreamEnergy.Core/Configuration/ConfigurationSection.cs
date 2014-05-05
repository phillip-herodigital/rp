using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Configuration
{
    class ConfigurationSection : System.Configuration.ConfigurationSection
    {
        [ConfigurationProperty("iocInitializers", IsDefaultCollection = false)]
        [ConfigurationCollection(typeof(ConfigurationElementCollection<IocInitializer, IocInitializer.KeyGenerator>),
            AddItemName = "add",
            ClearItemsName = "clear",
            RemoveItemName = "remove")]
        public ConfigurationElementCollection<IocInitializer, IocInitializer.KeyGenerator> InversionOfControlInitializers
        {
            get
            {
                return (ConfigurationElementCollection<IocInitializer, IocInitializer.KeyGenerator>)base["iocInitializers"];
            }
        }

    }
}
