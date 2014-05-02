using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public interface IState<TContext, TStateId>
        where TContext : ISanitizable
        where TStateId : struct
    {
        IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> PreconditionValidations();
        bool IsFinal { get; }

        TStateId Process(TContext data);
    }
}
