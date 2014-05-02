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
    public interface IStateMachine<TContext>
        where TContext : ISanitizable
    {
        void Initialize(TContext context, Type state);

        TContext Context { get; }
        Type State { get; }
        
        void Process(params Type[] stopAt);

        IEnumerable<ValidationResult> ValidationResults { get; }
    }
}
