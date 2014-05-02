using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    /// <summary>
    /// A basic interface for a state machine to run the State design pattern.
    /// </summary>
    /// <typeparam name="TContext">A type that contains the relevant data preserved between states</typeparam>
    /// <typeparam name="TStateId">A value type that can be 1:1 mapped to states in the state machine</typeparam>
    public interface IStateMachine<TContext, TStateId>
        where TContext : ISanitizable
        where TStateId : struct
    {
        void Initialize(TContext context, TStateId stateId);

        TContext Context { get; }
        TStateId StateId { get; }
        
        void Process(TStateId? stopAt = null);
    }
}
