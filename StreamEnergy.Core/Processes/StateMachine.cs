﻿using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public class StateMachine<TContext, TInternalContext> : IStateMachine<TContext, TInternalContext>
        where TContext : class, ISanitizable
        where TInternalContext : class
    {
        private readonly IUnityContainer container;
        private readonly IValidationService validationService;
        private IEnumerable<ValidationResult> lastValidations;

        public StateMachine(IValidationService validationService, IUnityContainer container)
        {
            this.validationService = validationService;
            this.container = container;
        }

        public void Initialize(Type state, TContext context, TInternalContext internalContext)
        {
            lastValidations = null;
            Context = context;
            context.Sanitize();

            RestoreStateFrom(state, ref internalContext, ref state);
            InternalContext = internalContext;
            State = state;
        }

        public TContext Context { get; private set; }

        public TInternalContext InternalContext { get; private set; }

        public Type State { get; private set; }

        public void Process(params Type[] stopAt)
        {
            Context.Sanitize();
            while (stopAt == null || !stopAt.Contains(State))
            {
                var state = GetState();
                if (state.IsFinal)
                    break;

                RunStateValidations(state);

                if (lastValidations.Any())
                    break;

                State = state.Process(Context, InternalContext);

                lastValidations = null;
                Context.Sanitize();
            }
        }

        public IEnumerable<ValidationResult> ValidationResults
        {
            get
            {
                if (lastValidations == null)
                {
                    RunStateValidations(GetState());
                }
                return lastValidations;
            }
        }

        public IEnumerable<ResolverOverride> ResolverOverrides { get; set; }

        public bool RestoreStateFrom(Type state, ref TInternalContext internalContext, ref Type currentState)
        {
            return BuildState(state).RestoreInternalState(this, ref internalContext, ref currentState);
        }

        protected IState<TContext, TInternalContext> GetState()
        {
            return BuildState(State);
        }

        private IState<TContext, TInternalContext> BuildState(Type state)
        {
            return container.Resolve(state, (ResolverOverrides ?? Enumerable.Empty<ResolverOverride>()).ToArray()) as IState<TContext, TInternalContext>;
        }

        private void RunStateValidations(IState<TContext, TInternalContext> state)
        {
            lastValidations = ValidateForState(state);
        }

        public IEnumerable<ValidationResult> ValidateForState(IState<TContext, TInternalContext> state)
        {
            var validations = new HashSet<ValidationResult>(validationService.PartialValidate(Context, state.PreconditionValidations().ToArray()));


            return validations.Concat(state.AdditionalValidations(Context, InternalContext)).ToArray();
        }

    }
}
