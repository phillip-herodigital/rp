using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Configuration;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.ServiceModel
{
    class LoggedServiceBehaviorExtensionElement : BehaviorExtensionElement
    {


        public override Type BehaviorType
        {
            get { return typeof(LoggedServiceEndpointBehavior); }
        }

        protected override object CreateBehavior()
        {
            return new LoggedServiceEndpointBehavior();
        }
    }
}
