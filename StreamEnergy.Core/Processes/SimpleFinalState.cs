using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public class SimpleFinalState<TContext> : IState<TContext>
        where TContext : ISanitizable
    {
        IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> IState<TContext>.PreconditionValidations()
        {
            return Enumerable.Empty<System.Linq.Expressions.Expression<Func<TContext, object>>>();
        }

        IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> IState<TContext>.AdditionalValidations(TContext data)
        {
            return Enumerable.Empty<System.ComponentModel.DataAnnotations.ValidationResult>();
        }

        bool IState<TContext>.IsFinal
        {
            get { return true; }
        }

        Type IState<TContext>.Process(TContext data)
        {
            return this.GetType();
        }
    }
}
