using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Core.Tests
{
    [TestClass]
    public class ValidationServiceTest
    {
        #region Classes for testing

        class Outer
        {
            [Required(ErrorMessage = "Inner Required")]
            [ValidateObject(PrefixMembers = true, ErrorMessagePrefix = "Inner ")]
            public Inner Inner { get; set; }

            [ValidateEnumerable(PrefixMembers = true, ErrorMessagePrefix = "InnerList ")]
            public IEnumerable<Inner> InnerList { get; set; }
        }

        class Inner
        {
            [Required(ErrorMessage = "Value1 Required")]
            public string Value1 { get; set; }

            [Required(ErrorMessage = "Value2 Required")]
            public string Value2 { get; set; }
        }

        #endregion

        private IValidationService CreateService()
        {
            var unity = new UnityContainer();
            var result = new ValidationService(unity);
            unity.RegisterInstance<IValidationService>(result);
            return result;
        }

        private static IEnumerable<string> AsComparable(IEnumerable<ValidationResult> results)
        {
            return results.SelectMany(r => r.MemberNames.Select(m => m + ": " + r.ErrorMessage));
        }

        [TestMethod]
        public void CompleteValidateTest()
        {
            var service = CreateService();
            var results = service.CompleteValidate(new Outer());

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner: Inner Required" }));

            results = service.CompleteValidate(new Outer()
                {
                    Inner = new Inner(),
                    InnerList = new[] { new Inner() }
                });

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required", "Inner.Value2: Inner Value2 Required", "InnerList[0].Value1: InnerList Value1 Required", "InnerList[0].Value2: InnerList Value2 Required" }));

            results = service.CompleteValidate(new Outer()
            {
                Inner = new Inner() { Value1 = "a", Value2 = "b" },
                InnerList = new[] { new Inner() { Value1 = "c", Value2 = "d" } }
            });

            Assert.IsFalse(AsComparable(results).Any());
        }

        [TestMethod]
        public void PartialValidateRootOnlyTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner, t => t.InnerList);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required", "Inner.Value2: Inner Value2 Required", "InnerList[0].Value1: InnerList Value1 Required", "InnerList[0].Value2: InnerList Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required", "Inner.Value2: Inner Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.InnerList);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "InnerList[0].Value1: InnerList Value1 Required", "InnerList[0].Value2: InnerList Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner()
            }, t => t.InnerList);

            Assert.IsFalse(AsComparable(results).Any());
        }

        [TestMethod]
        public void PartialValidateInnerTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner.Value1);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner.Value2);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value2: Inner Value2 Required" }));

        }
    }
}
