using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    public interface ITemperatureService
    {
        string CelciusToFahrenheit(string celcius);
        string FahrenheitToCelcius(string fahrenheit);

        Task<string> MockedExample();
        Task<Dictionary<string, object>> CachedExample();
    }
}
