﻿using System;
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
        private StateMachine<TContext, TInternalContext> stateMachine;
        private readonly string ContextSessionKey;
        private readonly string InternalContextSessionKey;
        private readonly string StateSessionKey;
        private readonly Type defaultState;
        private readonly bool storeInternal;

        private bool isInitialized;


        public StateMachineSessionHelper(HttpSessionStateBase session, IUnityContainer container, Type scope, Type defaultState, bool storeInternal)
        {
            this.session = session;
            this.container = container;
            this.defaultState = defaultState;
            this.storeInternal = storeInternal;

            ContextSessionKey = scope.FullName + " " + typeof(StateMachineSessionHelper<TContext, TInternalContext>).FullName + " " + typeof(TContext).FullName;
            InternalContextSessionKey = scope.FullName + " " + typeof(StateMachineSessionHelper<TContext, TInternalContext>).FullName + " " + typeof(TInternalContext).FullName;
            StateSessionKey = scope.FullName + " " + typeof(StateMachineSessionHelper<TContext, TInternalContext>).FullName + " State";
        }

        public TContext Context
        {
            get
            {
                EnsureInitialized();
                var context = session[ContextSessionKey] as TContext;
                if (context == null)
                    session[ContextSessionKey] = context = container.Resolve<TContext>();
                return context;
            }
            set { session[ContextSessionKey] = value; }
        }

        public Type State
        {
            get
            {
                EnsureInitialized();
                return (session[StateSessionKey] as Type) ?? defaultState;
            }
            set { session[StateSessionKey] = value; }
        }

        public TInternalContext InternalContext
        {
            get
            {
                EnsureInitialized();
                if (storeInternal)
                    return session[InternalContextSessionKey] as TInternalContext;
                else
                    return stateMachine.InternalContext;
            }
            set
            {
                if (storeInternal)
                    session[InternalContextSessionKey] = value;
            }
        }

        public IStateMachine<TContext, TInternalContext> StateMachine
        {
            get
            {
                EnsureInitialized();
                return stateMachine;
            }
        }

        public void Reset()
        {
            Context = null;
            State = null;
            InternalContext = null;

            isInitialized = false;
        }

        private void EnsureInitialized()
        {
            if (!isInitialized)
            {
                stateMachine = container.Resolve<StateMachine<TContext, TInternalContext>>();
                isInitialized = true;
                stateMachine.Initialize(State, Context, InternalContext);
            }
        }

        public void Dispose()
        {
            if (!isInitialized)
            {
                return;
            }

            Context = stateMachine.Context;
            State = stateMachine.State;
            InternalContext = stateMachine.InternalContext;
        }
    }
}