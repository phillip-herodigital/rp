using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

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

        public async Task Initialize(Type state, TContext context, TInternalContext internalContext)
        {
            lastValidations = null;
            Context = context;
            context.Sanitize();

            InternalContext = internalContext ?? container.Resolve<TInternalContext>();
            (await RestoreStateFrom(state, state)).Apply(ref state);
            State = state;
        }

        public TContext Context { get; private set; }

        public TInternalContext InternalContext { get; private set; }

        public Type State { get; private set; }

        public async Task Process(params Type[] stopAt)
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

                State = await state.Process(Context, InternalContext);

                lastValidations = null;
                Context.Sanitize();
                state.Sanitize(Context, InternalContext);

                if (state.ForceBreak(Context, InternalContext))
                {
                    break;
                }
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

        public async Task ContextUpdated()
        {
            var state = State;
            (await RestoreStateFrom(state, state)).Apply(ref state);
            State = state;
            Context.Sanitize();
            GetState().Sanitize(Context, InternalContext);
            lastValidations = null;
        }


        public async Task<RestoreInternalStateResult> RestoreStateFrom(Type state, Type currentState)
        {
            return await BuildState(state).RestoreInternalState(this, currentState);
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
            state.Sanitize(Context, InternalContext);
            var validations = new HashSet<ValidationResult>(validationService.PartialValidate(Context, state.PreconditionValidations().ToArray()));

            return validations.Concat(state.AdditionalValidations(Context, InternalContext)).Where(v => !state.IgnoreValidation(v, Context, InternalContext)).ToArray();
        }

    }
}
