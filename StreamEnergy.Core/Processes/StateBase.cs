using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public abstract class StateBase<TContext, TInternalContext> : IState<TContext, TInternalContext>
        where TContext : class, ISanitizable
        where TInternalContext : class
    {
        private Type previousState;
        private Type nextState;

        public StateBase(Type previousState, Type nextState)
        {
            this.previousState = previousState;
            this.nextState = nextState;
        }

        public virtual IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> PreconditionValidations()
        {
            yield return context => context;
        }

        public virtual void Sanitize(TContext context, TInternalContext internalContext)
        {
        }

        public virtual IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(TContext context, TInternalContext internalContext)
        {
            yield break;
        }

        public virtual bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, TContext context, TInternalContext internalContext)
        {
            return false;
        }

        public virtual bool IsFinal
        {
            get { return false; }
        }

        public virtual Type Process(TContext context, TInternalContext internalContext)
        {
            LoadInternalState(context, internalContext);

            return InternalProcess(context, internalContext);
        }

        protected virtual Type InternalProcess(TContext context, TInternalContext internalContext)
        {
            return nextState;
        }

        public virtual bool RestoreInternalState(IStateMachine<TContext, TInternalContext> stateMachine, ref Type state)
        {
            if (previousState != null && !stateMachine.RestoreStateFrom(previousState, ref state))
            {
                return false;
            }

            // Don't try to restore state if this is invalid.
            if (stateMachine.ValidateForState(this).Any())
            {
                state = this.GetType();
                return false;
            }

            if (NeedRestoreInternalState(stateMachine.Context, stateMachine.InternalContext))
            {
                LoadInternalState(stateMachine.Context, stateMachine.InternalContext);
            }

            return true;
        }

        protected virtual bool NeedRestoreInternalState(TContext context, TInternalContext internalContext)
        {
            return false;
        }

        protected virtual void LoadInternalState(TContext context, TInternalContext internalContext)
        {
        }
    }
}
