using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class TemperatureService : ITemperatureService
    {
        private Sample.Temperature.TempConvertSoap service;
        private HttpClient client;

        public TemperatureService(Sample.Temperature.TempConvertSoap service, HttpClient client)
        {
            this.service = service;
            this.client = client;
            client.BaseAddress = new Uri("http://www.example.com/");
        }

        string ITemperatureService.CelciusToFahrenheit(string celcius)
        {
            return service.CelsiusToFahrenheit(new Sample.Temperature.CelsiusToFahrenheitRequest { Celsius = celcius }).CelsiusToFahrenheitResult;
        }

        string ITemperatureService.FahrenheitToCelcius(string fahrenheit)
        {
            return AsyncHelper.RunSync(() => FahrenheitToCelcius(fahrenheit));
        }

        async Task<string> FahrenheitToCelcius(string fahrenheit)
        {
            var response = await client.GetAsync("?q=" + fahrenheit);

            return await response.Content.ReadAsAsync<string>();
        }
    }
}
