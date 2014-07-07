using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Processes
{
    public struct RestoreInternalStateResult
    {
        public bool Success;
        public Type State;

        public static RestoreInternalStateResult From(bool success, Type state)
        {
            return new RestoreInternalStateResult { Success = success, State = state };
        }
    }
}
