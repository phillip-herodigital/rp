using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.Extensions.ValidationChaining
{
    internal interface IChainedUtility<TPageModel, TCurrentModel>
    {

        HtmlHelper<TPageModel> Helper { get; }
        Expression<Func<TPageModel, TResultModel>> MergeExpression<TResultModel>(Expression<Func<TCurrentModel, TResultModel>> model);
        IEnumerable<System.Reflection.MemberInfo> GetPropertyChain(Expression temp);
        IHtmlString For<TResultModel>(Expression<Func<TCurrentModel, TResultModel>> model);

    }
}
