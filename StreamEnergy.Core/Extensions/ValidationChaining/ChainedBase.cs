using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.Extensions.ValidationChaining
{
    public class ChainedBase<TStartModel> : IChainedUtility<TStartModel, TStartModel>
    {
        private System.Web.Mvc.HtmlHelper<TStartModel> html;

        public ChainedBase(System.Web.Mvc.HtmlHelper<TStartModel> html)
        {
            this.html = html;
        }

        public HtmlHelper<TStartModel> Helper
        {
            get { return html; }
        }

        public IChainedAccess<TStartModel, TResultModel> AngularRepeat<TResultModel>(Expression<Func<TStartModel, IEnumerable<TResultModel>>> model, string indexValue)
        {
            return new ChainedValidation<TStartModel, TStartModel, TResultModel>(this, model, indexValue);
        }

        public Expression<Func<TStartModel, TResultModel>> MergeExpression<TResultModel>(Expression<Func<TStartModel, TResultModel>> model)
        {
            return model;
        }

        public IEnumerable<System.Reflection.MemberInfo> GetPropertyChain(Expression temp)
        {
            return StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
        }

        public System.Web.IHtmlString For<TResultModel>(System.Linq.Expressions.Expression<Func<TStartModel, TResultModel>> model)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();
            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            return html.Raw(StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain));
        }
    }
}
