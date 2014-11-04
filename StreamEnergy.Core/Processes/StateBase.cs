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
        protected Type previousState;
        protected Type nextState;

        public StateBase(Type previousState, Type nextState)
        {
            this.previousState = previousState;
            this.nextState = nextState;
        }

        public virtual IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> PreconditionValidations(TContext data, TInternalContext internalData)
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

        public virtual async Task<Type> Process(TContext context, TInternalContext internalContext)
        {
            if (NeedRestoreInternalState(context, internalContext))
            {
                await LoadInternalState(context, internalContext);
            }

            return await InternalProcess(context, internalContext);
        }

        protected virtual Task<Type> InternalProcess(TContext context, TInternalContext internalContext)
        {
            return Task.FromResult(nextState);
        }

        public virtual async Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<TContext, TInternalContext> stateMachine, Type state)
        {
            if (previousState != null)
            {
                var result = await stateMachine.RestoreStateFrom(previousState, state);
                state = result.State;
                if (!result.Success)
                {
                    return new RestoreInternalStateResult { Success = false, State = state };
                }
            }

            // Don't try to restore state if this is invalid.
            if (stateMachine.ValidateForState(this).Any())
            {
                state = this.GetType();
                return new RestoreInternalStateResult { Success = false, State = state };
            }

            if (NeedRestoreInternalState(stateMachine.Context, stateMachine.InternalContext))
            {
                await LoadInternalState(stateMachine.Context, stateMachine.InternalContext);
            }

            return new RestoreInternalStateResult { Success = true, State = state };
        }

        protected virtual bool NeedRestoreInternalState(TContext context, TInternalContext internalContext)
        {
            return false;
        }

        protected virtual Task LoadInternalState(TContext context, TInternalContext internalContext)
        {
            return Task.FromResult<object>(null);
        }

        public virtual bool ForceBreak(TContext context, TInternalContext internalContext)
        {
            return false;
        }
    }
}
