using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    /// <summary>
    /// A basic interface for a state machine to run the State design pattern.
    /// </summary>
    /// <typeparam name="TContext">A type that contains the relevant data preserved between states</typeparam>
    /// <typeparam name="TInternalContext">A type that contains relevant data internal to states that can be restored - a cache of sorts - specific to this flow</typeparam>
    public interface IStateMachine<TContext, TInternalContext>
        where TContext : class, ISanitizable
        where TInternalContext : class
    {
        void Initialize(Type state, TContext context, TInternalContext internalContext = null);

        TContext Context { get; }
        TInternalContext InternalContext { get; }
        Type State { get; }

        void ContextUpdated();

        bool RestoreStateFrom(Type state, ref Type currentState);

        void Process(params Type[] stopAt);

        IEnumerable<ValidationResult> ValidationResults { get; }

        IEnumerable<ValidationResult> ValidateForState(IState<TContext, TInternalContext> state);

    }
}
