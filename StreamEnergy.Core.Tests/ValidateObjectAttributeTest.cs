using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.ComponentModel.DataAnnotations;
using StreamEnergy.Extensions;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Core.Tests
{
    [TestClass]
    public class ValidateObjectAttributeTest
    {
        class DriversLicense
        {
            [Required(ErrorMessage = "Number Required")]
            [RegularExpression("^[0-9]+$", ErrorMessage="Number Invalid")]
            public string Number { get; set; }

            [Required(ErrorMessage = "State Required")]
            [RegularExpression("[A-Z]{2}")]
            public string State { get; set; }
        }

        class Outer
        {
            [ValidateObject(ErrorMessage = "Drivers License", ErrorMessagePrefix = "Drivers License ")]
            public DriversLicense DriversLicense { get; set; }
        }

        [TestMethod]
        public void IgnoreNullTest()
        {
            var target = new Outer();

            Validator.ValidateObject(target, new ValidationContext(target));
        }

        [TestMethod]
        public void InnerFields()
        {
            var unity = new UnityContainer();
            var validationService = new ValidationService(unity);
            unity.RegisterInstance<IValidationService>(validationService);

            var target = new Outer()
            {
                DriversLicense = new DriversLicense()
                {
                    Number = "TX"
                }
            };

            try
            {
                Validator.ValidateObject(target, validationService.CreateValidationContext(target), true);
                Assert.Fail("Should have thrown an Exception.");
            }
            catch (ValidationException ex)
            {
                var results = (ex.ValidationResult as IEnumerable<ValidationResult>).Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);

                Assert.IsTrue((from entry in results
                               from member in entry.MemberNames
                               select member + ": " + entry.ErrorMessage).SequenceEqual(new[] 
                                   { 
                                       "DriversLicense.Number: Drivers License Number Invalid", 
                                       "DriversLicense.State: Drivers License State Required", 
                                   }));
            }
        }
    }
}
