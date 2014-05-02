using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Processes
{
    public interface IState<TContext>
        where TContext : ISanitizable
    {
        IEnumerable<System.Linq.Expressions.Expression<Func<TContext, object>>> PreconditionValidations();
        IEnumerable<ValidationResult> AdditionalValidations(TContext data);
        bool IsFinal { get; }

        Type Process(TContext data);
    }
}
