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
            [Required(ErrorMessage="Username Required")]
            [RegularExpression("^[a-zA-Z0-9]{6,}$", ErrorMessage="Username Invalid")]
            public string Username { get; set; }

            [Required(ErrorMessage="Password Required")]
            public string Password { get; set; }

            [Required(ErrorMessage = "Password Confirmation Required")]
            [Compare("Password", ErrorMessage = "Password Confirmation Does Not Match")]
            public string ConfirmPassword { get; set; }

            // This is a bad regex for email addresses. I don't care; this is a test. Just don't re-use it.
            [Required(ErrorMessage = "Email Required")]
            [RegularExpression(@"[a-zA-Z0-9.]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+", ErrorMessage="Email Invalid")]
            public string Email { get; set; }

            public void Sanitize()
            {
                if (Username != null)
                    Username = Username.Trim();
                if (Email != null)
                    Email = Email.Trim();
            }
        }

        public enum CreateAccountStateId
        {
            GatherData,
            Verify,
            Confirmation
        }

        class GatherDataState : IState<CreateAccountContext, CreateAccountStateId>
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

            public bool IsFinal
            {
                get { return false; }
            }

            public CreateAccountStateId Process(CreateAccountContext data)
            {
                called();
                return CreateAccountStateId.Verify;
            }
        }

        class VerifyState : IState<CreateAccountContext, CreateAccountStateId>
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

            public bool IsFinal
            {
                get { return false; }
            }

            public CreateAccountStateId Process(CreateAccountContext data)
            {
                called();
                return CreateAccountStateId.Confirmation;
            }
        }

        class ConfirmationState : IState<CreateAccountContext, CreateAccountStateId>
        {
            private Action called;

            public ConfirmationState(Action called)
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

            public bool IsFinal
            {
                get { return true; }
            }

            public CreateAccountStateId Process(CreateAccountContext data)
            {
                called();
                return CreateAccountStateId.Confirmation;
            }
        }

        class CreateAccountStateMachine : StateMachine<CreateAccountContext, CreateAccountStateId>
        {
            private ICheckState mock;

            public CreateAccountStateMachine(ICheckState mock)
            {
                this.mock = mock;
            }

            protected override IState<CreateAccountContext, CreateAccountStateId> GetState()
            {
                switch (StateId)
                {
                    case CreateAccountStateId.GatherData:
                        return new GatherDataState(delegate { mock.Callback(CreateAccountStateId.GatherData); });
                    case CreateAccountStateId.Verify:
                        return new VerifyState(delegate { mock.Callback(CreateAccountStateId.Verify); });
                    case CreateAccountStateId.Confirmation:
                        return new ConfirmationState(delegate { mock.Callback(CreateAccountStateId.Confirmation); });
                    default:
                        throw new NotSupportedException();
                }
            }
        }

        #endregion

        public interface ICheckState
        {
            void Callback(CreateAccountStateId stateId);
        }

        private IStateMachine<CreateAccountContext, CreateAccountStateId> Create(ICheckState mock)
        {
            return new CreateAccountStateMachine(mock);
        }

        [TestMethod]
        public void NoProgressTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Username Required", "Password Required", "Password Confirmation Required" }));
            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void BlankValidationsTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Username Required", "Password Required", "Password Confirmation Required" }));
            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void FailedValidationTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = " tester";
            context.Password = "somePassword";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual("tester", context.Username);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Password Confirmation Required" }));
            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void InitialValidationsTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            stateMachine.Initialize(context, CreateAccountStateId.Verify);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Email Required" }));
            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void StopAtVerifyTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(CreateAccountStateId.GatherData)).Verifiable();

            stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Email Required" }));
            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }

        [TestMethod]
        public void PassThroughToConfirmationTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";
            context.Email = "a@b.c";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(CreateAccountStateId.GatherData)).Verifiable();
            mock.Setup(m => m.Callback(CreateAccountStateId.Verify)).Verifiable();

            stateMachine.Process();

            Assert.IsFalse(stateMachine.ValidationResults.Any());
            Assert.AreEqual(CreateAccountStateId.Confirmation, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }

        [TestMethod]
        public void StartAtVerifyTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            stateMachine.Initialize(context, CreateAccountStateId.Verify);

            context.Email = "a@b.c";

            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(CreateAccountStateId.Verify)).Verifiable();

            stateMachine.Process();

            Assert.IsFalse(stateMachine.ValidationResults.Any());
            Assert.AreEqual(CreateAccountStateId.Confirmation, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }

        [TestMethod]
        public void PauseAtVerifyTest()
        {
            var mock = new Moq.Mock<ICheckState>(Moq.MockBehavior.Strict);
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create(mock.Object);
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";
            context.Email = "a@b.c";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            mock.Setup(m => m.Callback(CreateAccountStateId.GatherData)).Verifiable();

            stateMachine.Process(stopAt: CreateAccountStateId.Verify);

            Assert.IsFalse(stateMachine.ValidationResults.Any());
            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
            mock.VerifyAll();
        }
    }
}
