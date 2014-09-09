using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Practices.Unity;
using Sitecore.Rules.Conditions;

namespace StreamEnergy.MyStream.Conditions
{
    public class MaintenanceModeCondition<T> : WhenCondition<T>
        where T : Sitecore.Rules.RuleContext
    {
        private readonly Injection dependencies;

        public class Injection
        {
            [Dependency]
            public ISettings Settings { get; set; }
        }
        
        public MaintenanceModeCondition()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }

        public MaintenanceModeCondition(Injection injectedValue)
        {
            dependencies = injectedValue;
        }

        protected override bool Execute(T ruleContext)
        {
            var isMaintenanceMode = !string.IsNullOrEmpty(dependencies.Settings.GetSettingsValue("Maintenance Mode", "Maintenance Mode"));

            return isMaintenanceMode;
        }
    }
}