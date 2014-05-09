using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Unity
{
    public abstract class InheritanceSetupStrategy : IContainerSetupStrategy
    {
        private readonly Type sampleType;

        public InheritanceSetupStrategy(Type sampleType)
        {
            this.sampleType = sampleType;
        }

        public void SetupUnity(IUnityContainer unityContainer)
        {
            foreach (var registration in from instanceType in sampleType.Assembly.GetTypes()
                                             where instanceType.Namespace == sampleType.Namespace
                                             from parentType in GetParentTypes(instanceType)
                                             select new { parentType, instanceType })
            {
                if (registration.instanceType.IsPublic)
                {
                    throw new InvalidOperationException("Implementation must not be public to prevent direct use. Use a public interface and mark implementation as internal. (When mapping `" + registration.instanceType.AssemblyQualifiedName + "`.)");
                }

                Register(unityContainer, registration.instanceType, registration.parentType);
            }
            AdditionalSetup(unityContainer);
        }

        protected virtual void AdditionalSetup(IUnityContainer unityContainer)
        {
        }

        protected virtual void Register(IUnityContainer unityContainer, Type instanceType, Type parentType)
        {
            unityContainer.RegisterType(parentType, instanceType);
        }

        protected abstract IEnumerable<Type> GetParentTypes(Type instanceType);
    }
}
