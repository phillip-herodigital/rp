using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public abstract class StateMachine<TContext, TStateId> : IStateMachine<TContext, TStateId>
        where TContext : ISanitizable
        where TStateId : struct
    {
        private IEnumerable<ValidationResult> lastValidations;
        public void Initialize(TContext context, TStateId stateId)
        {
            lastValidations = null;
            Context = context;
            StateId = stateId;

            context.Sanitize();
        }

        public TContext Context { get; private set; }

        public TStateId StateId { get; private set; }

        public void Process(TStateId? stopAt = null)
        {
            Context.Sanitize();
            while (!StateId.Equals(stopAt))
            {
                var state = GetState();
                if (state.IsFinal)
                    break;

                RunStateValidations(state);

                if (lastValidations.Any())
                    break;

                StateId = state.Process(Context);

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

        protected abstract IState<TContext, TStateId> GetState();

        private void RunStateValidations(IState<TContext, TStateId> state)
        {
            var validationContext = new ValidationContext(Context);
            var validations = new HashSet<ValidationResult>();
            foreach (var property in state.PreconditionValidations().Select(v => new { name = v.SimpleProperty().Name, value = v.CachedCompile<Func<TContext, object>>()(Context) }))
            {
                validationContext.MemberName = property.name;
                Validator.TryValidateProperty(property.value, validationContext, validations);
            }
            lastValidations = (IEnumerable<ValidationResult>)validations;
        }
    }
}
