using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Core.Tests.Processes
{
    [TestClass]
    public class StateMachineBehaviorTest
    {
        #region Tested implementations
        class CreateAccountContext : ISanitizable
        {
            [Required(ErrorMessage = "Username Required")]
            [RegularExpression("^[a-zA-Z0-9]{6,}$", ErrorMessage = "Username Invalid")]
            public string Username { get; set; }

            [Required(ErrorMessage = "Password Required")]
            public string Password { get; set; }

            [Required(ErrorMessage = "Password Confirmation Required")]
            [Compare("Password", ErrorMessage = "Password Confirmation Does Not Match")]
            public string ConfirmPassword { get; set; }

            // This is a bad regex for email addresses. I don't care; this is a test. Just don't re-use it.
            [Required(ErrorMessage = "Email Required")]
            [RegularExpression(@"[a-zA-Z0-9.]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+", ErrorMessage = "Email Invalid")]
            public string Email { get; set; }

            public void Sanitize()
            {
                if (Username != null)
                    Username = Username.Trim();
                if (Email != null)
                    Email = Email.Trim();
            }
        }

        class GatherDataState : IState<CreateAccountContext, object>
        {
            private Action called;

            public GatherDataState(Action called)
            {
                this.called = called ?? delegate { };
            }

            public IEnumerable<System.Linq.Expressions.Expression<Func<CreateAccountContext, object>>> PreconditionValidations()
            {
                yield return context => context.Username;
                yield return context => context.Password;
                yield return context => context.ConfirmPassword;
            }

            public void Sanitize(CreateAccountContext context, object internalContext)
            {
            }

            public IEnumerable<ValidationResult> AdditionalValidations(CreateAccountContext context, object internalContext)
            {
                return Enumerable.Empty<ValidationResult>();
            }

            bool IState<CreateAccountContext, object>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, CreateAccountContext context, object internalContext)
            {
                return false;
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Type Process(CreateAccountContext data, object internalContext)
            {
                called();
                return typeof(VerifyState);
            }

            public bool RestoreInternalState(IStateMachine<CreateAccountContext, object> stateMachine, ref Type state)
            {
                return true;
            }
        }

        class VerifyState : IState<CreateAccountContext, object>
        {
            private Action called;

            public VerifyState(Action called)
            {
                this.called = called ?? delegate { };
            }

            public IEnumerable<System.Linq.Expressions.Expression<Func<CreateAccountContext, object>>> PreconditionValidations()
            {
                yield return context => context.Username;
                yield return context => context.Password;
                yield return context => context.ConfirmPassword;
                yield return context => context.Email;
            }

            public void Sanitize(CreateAccountContext context, object internalContext)
            {
            }

            public IEnumerable<ValidationResult> AdditionalValidations(CreateAccountContext context, object internalContext)
            {
                return Enumerable.Empty<ValidationResult>();
            }

            bool IState<CreateAccountContext, object>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, CreateAccountContext context, object internalContext)
            {
                return false;
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Type Process(CreateAccountContext data, object internalContext)
            {
                called();
                return typeof(ConfirmationState);
            }

            public bool RestoreInternalState(IStateMachine<CreateAccountContext, object> stateMachine, ref Type state)
            {
                return true;
            }
        }

        class ConfirmationState : SimpleFinalState<CreateAccountContext, object> { }

        #endregion

        public interface ICheckState
        {
            void Callback(Type state);
        }

        private IStateMachine<CreateAccountContext, object> Create(ICheckState mock)
        {
            var unity = new UnityContainer();
            var result = new StateMachine<CreateAccountContext, object>(new ValidationService(unity), unity);
            result.ResolverOverrides = new ResolverOverride[] {
                    new DependencyOverride(typeof(Action), (Action)(() => mock.Callback(result.State)))
                };
            return result;
        }

        [TestMethod]
        public void NoProgressTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Username Required", "Password Required", "Password Confirmation Required" }));
            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void BlankValidationsTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Username Required", "Password Required", "Password Confirmation Required" }));
            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void FailedValidationTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            context.Username = " tester";
            context.Password = "somePassword";

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual("tester", context.Username);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Password Confirmation Required" }));
            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void InitialValidationsTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            stateMachine.Initialize(typeof(VerifyState), context);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Email Required" }));
            Assert.AreEqual(typeof(VerifyState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void StopAtVerifyTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(typeof(GatherDataState))).Verifiable();

            stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Email Required" }));
            Assert.AreEqual(typeof(VerifyState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }

        [TestMethod]
        public void PassThroughToConfirmationTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";
            context.Email = "a@b.c";

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(typeof(GatherDataState))).Verifiable();
            mock.Setup(m => m.Callback(typeof(VerifyState))).Verifiable();

            stateMachine.Process();

            Assert.IsFalse(stateMachine.ValidationResults.Any());
            Assert.AreEqual(typeof(ConfirmationState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }

        [TestMethod]
        public void StartAtVerifyTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            stateMachine.Initialize(typeof(VerifyState), context);

            context.Email = "a@b.c";

            Assert.AreEqual(typeof(VerifyState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(typeof(VerifyState))).Verifiable();

            stateMachine.Process();

            Assert.IsFalse(stateMachine.ValidationResults.Any());
            Assert.AreEqual(typeof(ConfirmationState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }

        [TestMethod]
        public void PauseAtVerifyTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            var stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";
            context.Email = "a@b.c";

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(typeof(GatherDataState))).Verifiable();

            stateMachine.Process(stopAt: typeof(VerifyState));

            Assert.IsFalse(stateMachine.ValidationResults.Any());
            Assert.AreEqual(typeof(VerifyState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }
    }
}
