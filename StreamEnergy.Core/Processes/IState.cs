using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public interface IState<TContext, TInternalContext>
        where TContext : class, ISanitizable
        where TInternalContext : class
    {
        IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> PreconditionValidations();
        IEnumerable<ValidationResult> AdditionalValidations(TContext data, TInternalContext internalContext);
        bool IsFinal { get; }

        Type Process(TContext data, TInternalContext internalContext);

        bool RestoreInternalState(IStateMachine<TContext, TInternalContext> stateMachine, ref TInternalContext internalContext, ref Type state);
    }
}
