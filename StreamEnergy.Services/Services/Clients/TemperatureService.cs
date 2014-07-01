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
        private HttpClient exampleClient;
        private HttpClient facebookClient;

        public TemperatureService(Sample.Temperature.TempConvertSoap service, HttpClient exampleClient, HttpClient facebookClient)
        {
            this.service = service;
            this.exampleClient = exampleClient;
            exampleClient.BaseAddress = new Uri("http://www.example.com/");
            this.facebookClient = facebookClient;
            facebookClient.BaseAddress = new Uri("http://graph.facebook.com/");
        }

        string ITemperatureService.CelciusToFahrenheit(string celcius)
        {
            return service.CelsiusToFahrenheit(new Sample.Temperature.CelsiusToFahrenheitRequest { Celsius = celcius }).CelsiusToFahrenheitResult;
        }

        string ITemperatureService.FahrenheitToCelcius(string fahrenheit)
        {
            return service.FahrenheitToCelsius(new Sample.Temperature.FahrenheitToCelsiusRequest { Fahrenheit = fahrenheit }).FahrenheitToCelsiusResult;
        }

        string ITemperatureService.MockedExample()
        {
            return AsyncHelper.RunSync(() => ExampleAsync());
        }

        Dictionary<string, object> ITemperatureService.CachedExample()
        {
            return AsyncHelper.RunSync(() => FacebookAsync());
        }

        async Task<string> ExampleAsync()
        {
            var response = await exampleClient.GetAsync("/test?param=1");

            return await response.Content.ReadAsAsync<string>();
        }

        async Task<Dictionary<string, object>> FacebookAsync()
        {
            var response = await facebookClient.GetAsync("/me");

            var content = await response.Content.ReadAsStringAsync();

            return Json.Read<Dictionary<string, object>>(content);
        }

    }
}
