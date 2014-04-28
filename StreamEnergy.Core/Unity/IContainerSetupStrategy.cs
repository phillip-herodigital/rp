using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Unity
{
    public interface IContainerSetupStrategy
    {
        void SetupUnity(Microsoft.Practices.Unity.IUnityContainer unityContainer);
    }
}
