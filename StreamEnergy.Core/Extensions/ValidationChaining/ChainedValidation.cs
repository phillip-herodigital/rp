using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.Extensions.ValidationChaining
{
    class ChainedValidation<TPageModel, TStartModel, TIntermediateModel> : IChainedAccess<TPageModel, TIntermediateModel>, IChainedUtility<TPageModel, TIntermediateModel>
    {
        private readonly IChainedUtility<TPageModel, TStartModel> previousLink;
        private System.Linq.Expressions.Expression<Func<TStartModel, IEnumerable<TIntermediateModel>>> model;
        private string indexValue;

        public ChainedValidation(IChainedUtility<TPageModel, TStartModel> previousLink, System.Linq.Expressions.Expression<Func<TStartModel, IEnumerable<TIntermediateModel>>> model, string indexValue)
        {
            this.previousLink = previousLink;
            this.model = model;
            this.indexValue = indexValue;
        }

        public HtmlHelper<TPageModel> Helper
        {
            get
            {
                return previousLink.Helper;
            }
        }


        public IEnumerable<System.Reflection.MemberInfo> GetPropertyChain(Expression temp)
        {
            var baseModel = model.RemoveLambdaBody().RemoveCast();
            return StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(baseModel as MemberExpression).Concat(
                StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression));
        }

        public Expression<Func<TPageModel, TResultModel>> MergeExpression<TResultModel>(Expression<Func<TIntermediateModel, TResultModel>> model)
        {
            var baseModel = previousLink.MergeExpression(this.model);
            var baseModelUnwrapped = baseModel.RemoveLambdaBody().RemoveCast();

            var childModelUnwrapped = model.RemoveLambdaBody().RemoveCast();

            var method = (((Expression<Func<IEnumerable<TIntermediateModel>, TIntermediateModel>>)(items => items.First())).RemoveLambdaBody() as MethodCallExpression).Method;

            Expression start = Expression.Call(null, method, baseModelUnwrapped);
            foreach (var member in StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(model.RemoveLambdaBody().RemoveCast() as MemberExpression))
            {
                if (!member.DeclaringType.IsAssignableFrom(start.Type))
                {
                    start = Expression.ConvertChecked(start, member.DeclaringType);
                }
                start = Expression.PropertyOrField(start, member.Name);
            }

            return Expression.Lambda<Func<TPageModel, TResultModel>>(start, baseModel.Parameters);
        }

        public IChainedAccess<TPageModel, TResultModel> AngularRepeat<TResultModel>(Expression<Func<TIntermediateModel, IEnumerable<TResultModel>>> model, string indexValue)
        {
            return new ChainedValidation<TPageModel, TIntermediateModel, TResultModel>(this, model, indexValue);
        }

        public System.Web.IHtmlString ErrorClass<TResultModel>(System.Linq.Expressions.Expression<Func<TIntermediateModel, TResultModel>> model)
        {
            return previousLink.Helper.Raw("data-val-error=\"" + For(model) + "\"");
        }

        public System.Web.IHtmlString For<TResultModel>(System.Linq.Expressions.Expression<Func<TIntermediateModel, TResultModel>> model)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();
            var propertyChain = StreamEnergy.CompositeValidationAttribute.UnrollPropertyChain(temp as MemberExpression);
            return previousLink.Helper.Raw(previousLink.For(this.model).ToHtmlString() + "[{{" + new HtmlString(indexValue).ToHtmlString() + "}}]" + StreamEnergy.CompositeValidationAttribute.GetPathedName(propertyChain).Prefix("."));
        }

        public System.Web.IHtmlString Attributes<TResultModel>(System.Linq.Expressions.Expression<Func<TIntermediateModel, TResultModel>> model, Sitecore.Data.Items.Item translateFrom = null, bool writeId = true, bool writeValue = true)
        {
            var temp = model.RemoveLambdaBody().RemoveCast();

            var propertyChain = GetPropertyChain(temp);
            var prefix = StreamEnergy.CompositeValidationAttribute.GetPrefix(propertyChain);

            var metadata = ModelMetadata.FromLambdaExpression(MergeExpression(model), Helper.ViewData);

            var clientRules = (from validator in ModelValidatorProviders.Providers.GetValidators(metadata, Helper.ViewContext)
                               from rule in validator.GetClientValidationRules()
                               let name = (prefix + rule.ErrorMessage)
                               select rule).ToArray();

            var dictionary = new Dictionary<string, object>();
            UnobtrusiveValidationAttributesGenerator.GetValidationAttributes(clientRules, dictionary);
            dictionary["name"] = For(model);
            if (writeId)
            {
                dictionary["id"] = For(model);
            }

            return Helper.Raw(string.Join(" ", from attr in dictionary
                                             select attr.Key + "=\"" + attr.Value + "\""));
        }

        public System.Web.IHtmlString MessageFor<TResultModel>(System.Linq.Expressions.Expression<Func<TIntermediateModel, TResultModel>> model)
        {
            return Helper.Raw(@"<span data-valmsg-for=""" + For(model).ToString() + @""" data-valmsg-replace=""true""></span>");
        }

        void IDisposable.Dispose()
        {
        }
    }
}
