using Sitecore.Web.UI.Sheer;
using Sitecore.Workflows.Simple;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace StreamEnergy.MyStream.Validators
{
    public class DisallowApprovingOwnChanges
    {
        public void Process(WorkflowPipelineArgs args)
        {
            if (args.DataItem.Statistics.UpdatedBy == Sitecore.Context.User.Name && !Sitecore.Context.User.IsAdministrator)
            {
                SheerResponse.Alert("You cannot approve your own changes", string.Empty);
                args.AbortPipeline();
            }
        }
    }
}