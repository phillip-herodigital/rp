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
        void Sanitize(TContext context, TInternalContext internalContext);
        IEnumerable<ValidationResult> AdditionalValidations(TContext context, TInternalContext internalContext);
        bool IgnoreValidation(ValidationResult validationResult, TContext context, TInternalContext internalContext);
        bool IsFinal { get; }

        Task<Type> Process(TContext context, TInternalContext internalContext);

        Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<TContext, TInternalContext> stateMachine, Type state);

        bool ForceBreak(TContext context, TInternalContext internalContext);
    }
}
