using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.Extensions;

namespace StreamEnergy.Core.Tests
{
    [TestClass]
    public class ValidationChainTest
    {
        class FarOuter
        {
            [ValidateEnumerable]
            public List<Outer> Wrapped { get; set; }
        }

        class Outer
        {
            [ValidateEnumerable]
            public List<Target> Items { get; set; }
            [ValidateEnumerable]
            public List<Nest> Nests { get; set; }
        }

        class Nest
        {
            [Required]
            public Target Target { get; set; }
        }

        class Target
        {
            [Required]
            public string Value { get; set; }
        }

        private IValidationService CreateService()
        {
            var unity = new UnityContainer();
            var result = new ValidationService(unity);
            unity.RegisterInstance<IValidationService>(result);
            return result;
        }

        [TestMethod]
        public void Assumption()
        {
            var result = CreateService().CompleteValidate(new Outer { Items = new List<Target> { new Target() } });
            Assert.AreEqual("Items[0].Value", result.Single().MemberNames.Single());            
        }

        [TestMethod]
        public void SimpleValidationChainFor()
        {
            var helper = new HtmlHelper<Outer>(new ViewContext(), new ViewPage<Outer>());

            var forIndex = helper.AngularRepeat(m => m.Items, "$index").For(item => item.Value);
            Assert.AreEqual("Items[{{$index}}].Value", forIndex.ToString());
        }

        [TestMethod]
        public void TwoDeepChainFor()
        {
            var helper = new HtmlHelper<FarOuter>(new ViewContext(), new ViewPage<FarOuter>());

            var forIndex = helper.AngularRepeat(m => m.Wrapped, "$parent.$index").AngularRepeat(m => m.Items, "$index").For(item => item.Value);
            Assert.AreEqual("Wrapped[{{$parent.$index}}].Items[{{$index}}].Value", forIndex.ToString());
        }

        [TestMethod]
        public void SimpleAttributes()
        {
            var helper = new HtmlHelper<Outer>(new ViewContext(), new ViewPage<Outer>());

            var chain = helper.AngularRepeat(m => m.Nests, "$index") as Extensions.ValidationChaining.ChainedValidation<Outer, Outer, Nest>;
            var expression = chain.MergeExpression(t => t.Target.Value);

            Assert.AreEqual("m => m.Nests.First().Target.Value", expression.ToString());
        }


    }
}
