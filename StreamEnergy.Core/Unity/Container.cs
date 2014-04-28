using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.Unity
{
    /// <summary>
    /// An Inversion of Control container based on Unity. Provides base uses
    /// 
    /// This is a public class that, for production environments, should be instantiated once. However, for test purposes, this class can be instantiated multiple times.
    /// </summary>
    public class Container
    {
        private readonly IUnityContainer unityContainer;
        private readonly object setupLock = new object();
        private bool isInitialized = false;

        /// <summary>
        /// The container instance, especially for objects not using the framework
        /// </summary>
        public static readonly Container Instance = new Container(new UnityContainer());

        /// <summary>
        /// Intentionally internal; used to construct a container. In production environments, only one container should be built.
        /// </summary>
        /// <param name="container"></param>
        internal Container(IUnityContainer container)
        {
            this.unityContainer = container;
        }
        
        /// <summary>
        /// Initializes the container using setup strategies
        /// </summary>
        /// <param name="setupStrategies">A set of setup strategies that receive the </param>
        public virtual void Initialize(params IContainerSetupStrategy[] setupStrategies)
        {
            lock (setupLock)
            {
                if (!isInitialized)
                    isInitialized = true;
                else
                    throw new InvalidOperationException("Can only set up the Container once!");

                foreach (var strategy in setupStrategies)
                {
                    strategy.SetupUnity(unityContainer);
                }
            }
        }

        /// <summary>
        /// Gets whether the container has been initialized
        /// </summary>
        public virtual bool IsInitialized
        {
            get { return isInitialized; }
        }

        /// <summary>
        /// Resolves a type using Unity. 
        /// 
        /// This simplified access is provided to reduce need for the Microsoft.Practices.Unity using statement in files for extension methods.
        /// </summary>
        /// <typeparam name="T">The type to resolve</typeparam>
        /// <returns>The object as resolved from Unity</returns>
        public virtual T Resolve<T>()
        {
            return unityContainer.Resolve<T>();
        }

        /// <summary>
        /// Resolves a type using Unity by an identifying name, such as for resolving strategies.
        /// </summary>
        /// <typeparam name="T">The type to resolve</typeparam>
        /// <param name="name">The name of the type to resolve</param>
        /// <param name="resolverOverrides">The resolver overrides, if any, to apply. Useful for resolving strategies.</param>
        /// <returns>The object as resolved from Unity</returns>
        public virtual T Resolve<T>(string name, params ResolverOverride[] resolverOverrides)
        {
            return unityContainer.Resolve<T>(name, resolverOverrides);
        }

        /// <summary>
        /// Gets direct access to the unity container for advanced usage.
        /// </summary>
        public virtual IUnityContainer Unity
        {
            get { return unityContainer; }
        }

        /// <summary>
        /// Builds an object of type T using the singleton instance. This is added for ease of access.
        /// </summary>
        /// <typeparam name="T">The type to build.</typeparam>
        /// <returns>An instance of the type, provided Unity can resolve it.</returns>
        public static T Build<T>()
        {
            return Instance.Resolve<T>();
        }
    }
}
