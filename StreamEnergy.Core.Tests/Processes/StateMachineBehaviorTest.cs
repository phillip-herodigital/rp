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
            [Required]
            [RegularExpression("^[a-zA-Z0-9]{6,}$")]
            public string Username { get; set; }

            [Required]
            public string Password { get; set; }

            [Required]
            [Compare("Password")]
            public string ConfirmPassword { get; set; }

            // This is a bad regex for email addresses. I don't care; this is a test. Just don't re-use it.
            [Required]
            [RegularExpression(@"[a-zA-Z0-9.]+\@[a-zA-Z0-9]+\.[a-zA-Z0-9]+")]
            public string Email { get; set; }

            public void Sanitize()
            {
                if (Username != null)
                    Username = Username.Trim();
                if (Email != null)
                    Email = Email.Trim();
            }
        }

        enum CreateAccountStateId
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

            protected override IState<CreateAccountContext, CreateAccountStateId> GetState()
            {
                switch (StateId)
                {
                    case CreateAccountStateId.GatherData:
                        return new GatherDataState(null);
                    case CreateAccountStateId.Verify:
                        return new VerifyState(null);
                    case CreateAccountStateId.Confirmation:
                        return new ConfirmationState(null);
                    default:
                        throw new NotSupportedException();
                }
            }
        }

        #endregion

        private IStateMachine<CreateAccountContext, CreateAccountStateId> Create()
        {
            return new CreateAccountStateMachine();
        }

        [TestMethod]
        public void NoProgressTest()
        {
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create();
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void FailedValidationTest()
        {
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create();
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = " tester";
            context.Password = "somePassword";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual("tester", context.Username);

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void StopAtVerifyTest()
        {
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create();
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void PassThroughToConfirmationTest()
        {
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create();
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";
            context.Email = "a@b.c";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual(CreateAccountStateId.Confirmation, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void StartAtVerifyTest()
        {
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create();
            var context = new CreateAccountContext();

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";

            stateMachine.Initialize(context, CreateAccountStateId.Verify);

            context.Email = "a@b.c";

            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process();

            Assert.AreEqual(CreateAccountStateId.Confirmation, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void PauseAtVerifyTest()
        {
            IStateMachine<CreateAccountContext, CreateAccountStateId> stateMachine = Create();
            var context = new CreateAccountContext();

            stateMachine.Initialize(context, CreateAccountStateId.GatherData);

            context.Username = "tester";
            context.Password = "somePassword";
            context.ConfirmPassword = "somePassword";
            context.Email = "a@b.c";

            Assert.AreEqual(CreateAccountStateId.GatherData, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);

            stateMachine.Process(stopAt: CreateAccountStateId.Verify);

            Assert.AreEqual(CreateAccountStateId.Verify, stateMachine.StateId);
            Assert.AreEqual(context, stateMachine.Context);
        }
    }
}
