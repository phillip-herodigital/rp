using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;

namespace StreamEnergy.MyStream.Models
{
    public class StateMachineSessionHelper<TContext, TInternalContext> : IDisposable
        where TContext : class, ISanitizable
        where TInternalContext : class
    {
        private readonly HttpSessionStateBase session;
        private readonly IUnityContainer container;
        private readonly StateMachine<TContext, TInternalContext> stateMachine;
        private bool isInitialized;
        private bool isReset;
        private string ContextSessionKey;
        private string InternalContextSessionKey;
        private string StateSessionKey;


        public StateMachineSessionHelper(HttpSessionStateBase session, StateMachine<TContext, TInternalContext> stateMachine, IUnityContainer container)
        {
            this.session = session;
            this.container = container;
            this.stateMachine = stateMachine;

        }

        public void Initialize(Type scope)
        {
            if (isInitialized)
                throw new InvalidOperationException();
            isInitialized = true;

            ContextSessionKey = scope.FullName + " " + typeof(StateMachineSessionHelper<TContext, TInternalContext>).FullName + " " + typeof(TContext).FullName;
            InternalContextSessionKey = scope.FullName + " " +typeof(StateMachineSessionHelper<TContext, TInternalContext>).FullName + " " + typeof(TInternalContext).FullName;
            StateSessionKey = scope.FullName + " " + typeof(StateMachineSessionHelper<TContext, TInternalContext>).FullName + " State";
            stateMachine.Initialize(State, Context, InternalContext);
        }

        public TContext Context
        {
            get
            {
                if (!isInitialized)
                    throw new InvalidOperationException();
                var context = session[ContextSessionKey] as TContext;
                if (context == null)
                    session[ContextSessionKey] = context = container.Resolve<TContext>();
                return context;
            }
            set
            {
                if (!isInitialized)
                    throw new InvalidOperationException();
                session[ContextSessionKey] = value;
            }
        }

        public Type State
        {
            get
            {
                if (!isInitialized)
                    throw new InvalidOperationException();
                return (session[StateSessionKey] as Type) ?? typeof(DomainModels.Enrollments.ServiceInformationState);
            }
            set
            {
                if (!isInitialized)
                    throw new InvalidOperationException();
                session[StateSessionKey] = value;
            }
        }

        public TInternalContext InternalContext
        {
            get
            {
                if (!isInitialized)
                    throw new InvalidOperationException();
                return session[InternalContextSessionKey] as TInternalContext;
            }
            set
            {
                if (!isInitialized)
                    throw new InvalidOperationException();
                session[InternalContextSessionKey] = value;
            }
        }

        public IStateMachine<TContext, TInternalContext> StateMachine
        {
            get { return stateMachine; }
        }

        public void Reset()
        {
            isReset = true;
        }

        public void Dispose()
        {
            if (!isReset)
            {
                Context = stateMachine.Context;
                State = stateMachine.State;
                InternalContext = stateMachine.InternalContext;
            }
            else
            {
                Context = null;
                State = null;
                InternalContext = null;
            }
        }
    }
}