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
            public IEnumerable<System.Linq.Expressions.Expression<Func<GetOffersContext, object>>> PreconditionValidations()
            {
                yield return context => context.Address;
            }

            public IEnumerable<ValidationResult> AdditionalValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                return Enumerable.Empty<ValidationResult>();
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Type Process(GetOffersContext data, GetOffersInternalContext internalData)
            {
                LoadAddressInfo(data, internalData);
                return typeof(LoadOffersState);
            }

            public bool RestoreInternalState(IStateMachine<GetOffersContext, GetOffersInternalContext> stateMachine, ref GetOffersInternalContext internalContext, ref Type state)
            {
                if (internalContext == null)
                {
                    internalContext = new GetOffersInternalContext();
                }

                // Don't try to restore state if this is invalid.
                if (stateMachine.ValidateForState(this).Any())
                {
                    state = this.GetType();
                    return false;
                }

                if (string.IsNullOrEmpty(internalContext.DeliveryUtility))
                {
                    LoadAddressInfo(stateMachine.Context, internalContext);
                }
                return true;
            }

            private void LoadAddressInfo(GetOffersContext data, GetOffersInternalContext internalData)
            {
                internalData.DeliveryUtility = "Centerpoint";
            }
        }

        class LoadOffersState : IState<GetOffersContext, GetOffersInternalContext>
        {
            public IEnumerable<System.Linq.Expressions.Expression<Func<GetOffersContext, object>>> PreconditionValidations()
            {
                yield return context => context.Address;
            }

            public IEnumerable<ValidationResult> AdditionalValidations(GetOffersContext data, GetOffersInternalContext internalData)
            {
                return Enumerable.Empty<ValidationResult>();
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Type Process(GetOffersContext data, GetOffersInternalContext internalData)
            {
                LoadOffers(data, internalData);
                return typeof(DisplayOffersState);
            }

            public bool RestoreInternalState(IStateMachine<GetOffersContext, GetOffersInternalContext> stateMachine, ref GetOffersInternalContext internalContext, ref Type state)
            {
                if (!stateMachine.RestoreStateFrom(typeof(GatherDataState), ref internalContext, ref state))
                {
                    return false;
                }

                if (internalContext.Offers == null)
                {
                    LoadOffers(stateMachine.Context, internalContext);
                }
                return true;
            }

            private void LoadOffers(GetOffersContext data, GetOffersInternalContext internalData)
            {
                internalData.HasOffers = true;
                internalData.Offers = new[] { new object() };
            }
        }

        class DisplayOffersState : IState<GetOffersContext, GetOffersInternalContext>
        {
            public IEnumerable<System.Linq.Expressions.Expression<Func<GetOffersContext, object>>> PreconditionValidations()
            {
                yield return context => context.Address;
                yield return context => context.ChosenOffer;
            }

            public IEnumerable<ValidationResult> AdditionalValidations(GetOffersContext data, GetOffersInternalContext internalContext)
            {
                if (data.ChosenOffer != null && !internalContext.Offers.Contains(data.ChosenOffer))
                {
                    yield return new ValidationResult("Selected Offer Invalid", new[] { "ChosenOffer" });
                }
            }

            public bool IsFinal
            {
                get { return false; }
            }

            public Type Process(GetOffersContext data, GetOffersInternalContext internalContext)
            {
                // Intentionally not implemented - shouldn't be able to get past the "AdditionalValidations".
                throw new NotImplementedException();
            }

            public bool RestoreInternalState(IStateMachine<GetOffersContext, GetOffersInternalContext> stateMachine, ref GetOffersInternalContext internalContext, ref Type state)
            {
                if (!stateMachine.RestoreStateFrom(typeof(LoadOffersState), ref internalContext, ref state))
                {
                    return false;
                }

                return true;
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
        public void NoProgressTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            Assert.IsNotNull(stateMachine.InternalContext);

            stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Address Required" }));
            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void StandardProgressTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            stateMachine.Initialize(typeof(GatherDataState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            Assert.IsNotNull(stateMachine.InternalContext);

            context.Address = "123 Test St";

            stateMachine.Process();

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Selected Offer Required" }));
            Assert.AreEqual(typeof(DisplayOffersState), stateMachine.State);
            Assert.AreEqual("Centerpoint", stateMachine.InternalContext.DeliveryUtility);
            Assert.AreEqual(true, stateMachine.InternalContext.HasOffers);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void RestoreDisplayOffersTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            context.Address = "123 Test St";

            stateMachine.Initialize(typeof(DisplayOffersState), context);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Selected Offer Required" }));
            Assert.AreEqual(typeof(DisplayOffersState), stateMachine.State);
            Assert.AreEqual("Centerpoint", stateMachine.InternalContext.DeliveryUtility);
            Assert.AreEqual(true, stateMachine.InternalContext.HasOffers);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void RestoreDisplayOffersBlockedTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            context.Address = "123 Test St";
            context.ChosenOffer = "ABC123";

            stateMachine.Initialize(typeof(DisplayOffersState), context);

            Assert.IsTrue(stateMachine.ValidationResults.Select(r => r.ErrorMessage).SequenceEqual(new[] { "Selected Offer Invalid" }));
            Assert.AreEqual(typeof(DisplayOffersState), stateMachine.State);
            Assert.AreEqual("Centerpoint", stateMachine.InternalContext.DeliveryUtility);
            Assert.AreEqual(true, stateMachine.InternalContext.HasOffers);
            Assert.AreEqual(context, stateMachine.Context);
        }

        [TestMethod]
        public void RestoreFailedTest()
        {
            var stateMachine = Create();
            var context = new GetOffersContext();

            stateMachine.Initialize(typeof(DisplayOffersState), context);

            Assert.AreEqual(typeof(GatherDataState), stateMachine.State);
            Assert.AreEqual(context, stateMachine.Context);
            Assert.IsNotNull(stateMachine.InternalContext);
        }
    }
}
