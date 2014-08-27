using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.Core.Tests.Processes
{
    /// <summary>
    /// Summary description for StateMachineInternalTrackerTest
    /// </summary>
    [TestClass]
    public class StateMachineInternalTrackerTest
    {
        #region Tested implementations
        class GetOffersContext : ISanitizable
        {
            [Required(ErrorMessage = "Address Required")]
            public string Address { get; set; }

            [Required(ErrorMessage = "Selected Offer Required")]
            public string ChosenOffer { get; set; }

            public void Sanitize()
            {
            }
        }

        class GetOffersInternalContext
        {
            public string DeliveryUtility { get; set; }
            public bool HasOffers { get; set; }
            public IEnumerable<object> Offers { get; set; }
        }

        class GatherDataState : IState<GetOffersContext, GetOffersInternalContext>
        {
            public IEnumerable<System.Linq.Expressions.Expression<Func<GetOffersContext, object>>> PreconditionValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                yield return context => context.Address;
            }

            public void Sanitize(GetOffersContext data, GetOffersInternalContext internalData)
            {
            }

            public IEnumerable<ValidationResult> AdditionalValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                return Enumerable.Empty<ValidationResult>();
            }

            bool IState<GetOffersContext, GetOffersInternalContext>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, GetOffersContext data, GetOffersInternalContext internalData)
            {
                return false;
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Task<Type> Process(GetOffersContext data, GetOffersInternalContext internalData)
            {
                LoadAddressInfo(data, internalData);
                return Task.FromResult(typeof(LoadOffersState));
            }

            public Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<GetOffersContext, GetOffersInternalContext> stateMachine, Type state)
            {
                // Don't try to restore state if this is invalid.
                if (stateMachine.ValidateForState(this).Any())
                {
                    return Task.FromResult(RestoreInternalStateResult.From(false, this.GetType()));
                }

                if (string.IsNullOrEmpty(stateMachine.InternalContext.DeliveryUtility))
                {
                    LoadAddressInfo(stateMachine.Context, stateMachine.InternalContext);
                }
                return Task.FromResult(RestoreInternalStateResult.From(true, state));
            }

            private void LoadAddressInfo(GetOffersContext data, GetOffersInternalContext internalData)
            {
                internalData.DeliveryUtility = "Centerpoint";
            }

            public bool ForceBreak(GetOffersContext context, GetOffersInternalContext internalContext)
            {
                return false;
            }
        }

        class LoadOffersState : IState<GetOffersContext, GetOffersInternalContext>
        {
            public IEnumerable<System.Linq.Expressions.Expression<Func<GetOffersContext, object>>> PreconditionValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                yield return context => context.Address;
            }

            public void Sanitize(GetOffersContext data, GetOffersInternalContext internalData)
            {
            }

            public IEnumerable<ValidationResult> AdditionalValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                return Enumerable.Empty<ValidationResult>();
            }

            bool IState<GetOffersContext, GetOffersInternalContext>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, GetOffersContext data, GetOffersInternalContext internalData)
            {
                return false;
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Task<Type> Process(GetOffersContext data, GetOffersInternalContext internalData)
            {
                LoadOffers(data, internalData);
                return Task.FromResult(typeof(DisplayOffersState));
            }

            public async Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<GetOffersContext, GetOffersInternalContext> stateMachine, Type state)
            {
                if (!(await stateMachine.RestoreStateFrom(typeof(GatherDataState), state)).Apply(ref state))
                {
                    return RestoreInternalStateResult.From(false, state);
                }

                if (stateMachine.InternalContext.Offers == null)
                {
                    LoadOffers(stateMachine.Context, stateMachine.InternalContext);
                }
                return RestoreInternalStateResult.From(true, state);
            }

            private void LoadOffers(GetOffersContext data, GetOffersInternalContext internalData)
            {
                internalData.HasOffers = true;
                internalData.Offers = new[] { new object() };
            }

            public bool ForceBreak(GetOffersContext context, GetOffersInternalContext internalContext)
            {
                return false;
            }
        }

        class DisplayOffersState : IState<GetOffersContext, GetOffersInternalContext>
        {
            public IEnumerable<System.Linq.Expressions.Expression<Func<GetOffersContext, object>>> PreconditionValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                yield return context => context.Address;
                yield return context => context.ChosenOffer;
            }

            public void Sanitize(GetOffersContext data, GetOffersInternalContext internalData)
            {
            }

            public IEnumerable<ValidationResult> AdditionalValidations(GetOffersContext data, GetOffersInternalContext internalContext)
            {
                if (data.ChosenOffer != null && !internalContext.Offers.Contains(data.ChosenOffer))
                {
                    yield return new ValidationResult("Selected Offer Invalid", new[] { "ChosenOffer" });
                }
            }

            bool IState<GetOffersContext, GetOffersInternalContext>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, GetOffersContext data, GetOffersInternalContext internalContext)
            {
                return false;
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Task<Type> Process(GetOffersContext data, GetOffersInternalContext internalContext)
            {
                // Intentionally not implemented - shouldn't be able to get past the "AdditionalValidations".
                throw new NotImplementedException();
            }

            public async Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<GetOffersContext, GetOffersInternalContext> stateMachine, Type state)
            {
                if (!(await stateMachine.RestoreStateFrom(typeof(LoadOffersState), state)).Apply(ref state))
                {
                    return RestoreInternalStateResult.From(false, state);
                }

                return RestoreInternalStateResult.From(true, state);
            }

            public bool ForceBreak(GetOffersContext context, GetOffersInternalContext internalContext)
            {
                return false;
            }
        }

        #endregion

        private IStateMachine<GetOffersContext, GetOffersInternalContext> Create()
        {
            var unity = new UnityContainer();
            var result = new StateMachine<GetOffersContext, GetOffersInternalContext>(new ValidationService(), unity);
            return result;
        }


        [TestMethod]
        public async Task NoProgressTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            await stateMachine.Initialize(typeof(GatherDataState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            Assert.IsNotNull(stateMachine.InternalContext);

            await stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Address Required" }));
            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public async Task StandardProgressTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            await stateMachine.Initialize(typeof(GatherDataState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            Assert.IsNotNull(stateMachine.InternalContext);

            context.Address = "123 Test St";

            await stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Selected Offer Required" }));
            Assert.AreEqual(typeof(DisplayOffersState), stateMachine.State);
            Assert.AreEqual("Centerpoint", stateMachine.InternalContext.DeliveryUtility);
            Assert.AreEqual(true, stateMachine.InternalContext.HasOffers);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public async Task RestoreDisplayOffersTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            context.Address = "123 Test St";

            await stateMachine.Initialize(typeof(DisplayOffersState), context);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Selected Offer Required" }));
            Assert.AreEqual(typeof(DisplayOffersState), stateMachine.State);
            Assert.AreEqual("Centerpoint", stateMachine.InternalContext.DeliveryUtility);
            Assert.AreEqual(true, stateMachine.InternalContext.HasOffers);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public async Task RestoreDisplayOffersBlockedTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            context.Address = "123 Test St";
            context.ChosenOffer = "ABC123";

            await stateMachine.Initialize(typeof(DisplayOffersState), context);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Selected Offer Invalid" }));
            Assert.AreEqual(typeof(DisplayOffersState), stateMachine.State);
            Assert.AreEqual("Centerpoint", stateMachine.InternalContext.DeliveryUtility);
            Assert.AreEqual(true, stateMachine.InternalContext.HasOffers);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public async Task RestoreFailedTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            await stateMachine.Initialize(typeof(DisplayOffersState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            Assert.IsNotNull(stateMachine.InternalContext);
        }
    }
}
