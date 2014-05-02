using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public class StateMachine<TContext> : IStateMachine<TContext>
        where TContext : ISanitizable
    {
        private readonly IUnityContainer container;
        private IEnumerable<ValidationResult> lastValidations;

        public StateMachine(IUnityContainer container)
        {
            this.container = container;
        }

        public void Initialize(TContext context, Type state)
        {
            lastValidations = null;
            Context = context;
            State = state;

            context.Sanitize();
        }

        public TContext Context { get; private set; }

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

                State = state.Process(Context);

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

        protected IState<TContext> GetState()
        {
            return (IState<TContext>)container.Resolve(State, (ResolverOverrides ?? Enumerable.Empty<ResolverOverride>()).ToArray());
        }

        private void RunStateValidations(IState<TContext> state)
        {
            var validationContext = new ValidationContext(Context);
            var validations = new HashSet<ValidationResult>();
            foreach (var property in state.PreconditionValidations().Select(v => new { name = v.SimpleProperty().Name, value = v.CachedCompile<Func<TContext, object>>()(Context) }))
            {
                validationContext.MemberName = property.name;
                Validator.TryValidateProperty(property.value, validationContext, validations);
            }

            lastValidations = validations.Concat(state.AdditionalValidations(Context)).ToArray();
        }
    }
}
