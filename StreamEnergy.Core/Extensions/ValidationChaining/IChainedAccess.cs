using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Sitecore.Data.Items;

namespace StreamEnergy.Extensions.ValidationChaining
{
    public interface IChainedAccess<TPageModel, TCurrentModel> : IDisposable
    {
        IChainedAccess<TPageModel, TResultModel> AngularRepeat<TResultModel>(Expression<Func<TCurrentModel, IEnumerable<TResultModel>>> model, string indexValue);
        IHtmlString ErrorClass<TResultModel>(Expression<Func<TCurrentModel, TResultModel>> model);
        IHtmlString For<TResultModel>(Expression<Func<TCurrentModel, TResultModel>> model);
        IHtmlString Attributes<TResultModel>(Expression<Func<TCurrentModel, TResultModel>> model, Item translateFrom = null, bool writeId = true, bool writeValue = true);
    }
}
