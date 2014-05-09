using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class TemperatureService : ITemperatureService
    {
        private Sample.Temperature.TempConvertSoap service;

        public TemperatureService(Sample.Temperature.TempConvertSoap service)
        {
            this.service = service;
        }

        string ITemperatureService.CelciusToFahrenheit(string celcius)
        {
            return service.CelsiusToFahrenheit(new Sample.Temperature.CelsiusToFahrenheitRequest { Celsius = celcius }).CelsiusToFahrenheitResult;
        }

        string ITemperatureService.FahrenheitToCelcius(string fahrenheit)
        {
            return service.FahrenheitToCelsius(new Sample.Temperature.FahrenheitToCelsiusRequest { Fahrenheit = fahrenheit }).FahrenheitToCelsiusResult;
        }
    }
}
