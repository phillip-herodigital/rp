using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public static class RestoreInternalStateResultExtensions
    {
        public static bool Apply(this RestoreInternalStateResult target, ref Type state)
        {
            state = target.State;
            return target.Success;
        }
    }
}
