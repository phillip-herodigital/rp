using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public class SimpleFinalState<TContext, TInternalContext> : IState<TContext, TInternalContext>
        where TContext : class, ISanitizable
        where TInternalContext : class
    {
        IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> IState<TContext, TInternalContext>.PreconditionValidations()
        {
            return Enumerable.Empty<System.Linq.Expressions.Expression<Func<TContext, object>>>();
        }

        IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> IState<TContext, TInternalContext>.AdditionalValidations(TContext data, TInternalContext internalData)
        {
            return Enumerable.Empty<System.ComponentModel.DataAnnotations.ValidationResult>();
        }

        bool IState<TContext, TInternalContext>.IsFinal
        {
            get { return true; }
        }

        Type IState<TContext, TInternalContext>.Process(TContext data, TInternalContext internalData)
        {
            return this.GetType();
        }

        /// <summary>
        /// Override in a subclass to verify that all the information is available to keep the user in the final state.
        /// </summary>
        /// <param name="stateMachine">The state machine</param>
        /// <param name="internalContext">The internal state</param>
        /// <param name="state">The state machine's state</param>
        public virtual bool RestoreInternalState(IStateMachine<TContext, TInternalContext> stateMachine, ref TInternalContext internalContext, ref Type state)
        {
            return true;
        }
    }
}
