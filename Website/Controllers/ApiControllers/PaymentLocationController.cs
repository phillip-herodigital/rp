using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using System.Configuration;
using StackExchange.Redis;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using StreamEnergy.MyStream.Models.Marketing;
using System.Data.SqlClient;

using System.Device.Location;
namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    [RoutePrefix("api/paymentlocations")]
    public class PaymentLocationController : ApiController
    {
        private readonly IDatabase redis;
        private readonly IUnityContainer container;

        private static ConnectionMultiplexer Connection;
        private IDatabase cache;
        public PaymentLocationController(IUnityContainer container, IDatabase redis)
        {
            this.container = container;
            this.redis = redis;
        }

        private string formatPhoneNumber(string phoneNumber) {
            phoneNumber = phoneNumber.Replace("-", "").Replace("(", "").Replace(")", "").Trim();
           
            return String.Format("{0:(###) ###-####}", phoneNumber);
        }

        private double getDistance(GeoCoordinate A, GeoCoordinate B) {
            return A.GetDistanceTo(B) / 1609.344; //Convert meters to miles
        }

        [HttpGet]
        [Route("{lat}/{lng}/{maxLat}/{maxLon}/{minLat}/{minLon}/{maxResults}/{useCache}")]
        public List<PaymentLocation> Get(string lat, string lng, string maxLat, 
            string maxLon, string minLat, string minLon, int maxResults, string useCache) {

            List<PaymentLocation> results = new List<PaymentLocation>();
            string key = string.Format("{0}|{1}|{2}", lat+lng, maxLat+maxLon+minLat+minLon, 
                maxResults.ToString());

            if (Connection == null || !Connection.IsConnected)
            {
                Connection = ConnectionMultiplexer.Connect(ConfigurationManager.ConnectionStrings["redisCache"].ConnectionString);
            }
            cache = Connection.GetDatabase();

            //Add request logic here

            bool cacheExists = false;


            if (bool.Parse(useCache)) {
                results = getCachedResults(key, out cacheExists);

                if (cacheExists)
                {
                    return results;
                }
            }
           
            GeoCoordinate centerLoc = new GeoCoordinate(double.Parse(lat), double.Parse(lng));
            
            string connectionString = Sitecore.Configuration.Settings.GetConnectionString("core");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    /*command.CommandText = @"
Select * from [paymentLocations] 
where 
lat=@lat and lon =@lon
";*/

                    command.CommandText = @"
Select * from [paymentLocations] 
        Where Lat Between @minLat And @maxLat
          And Lon Between @minLon And @maxLon
";
                    /*command.Parameters.AddWithValue("@lat", lat);
                    command.Parameters.AddWithValue("@lon", lng);*/

                    command.Parameters.AddWithValue("@minLat", minLat);
                    command.Parameters.AddWithValue("@minLon", minLon);
                    command.Parameters.AddWithValue("@maxLat", maxLat);
                    command.Parameters.AddWithValue("@maxLon", maxLon);

                    using (var reader = command.ExecuteReader())
                    {
                        var userContext = new DomainModels.Enrollments.UserContext();

                        if (reader.HasRows) {
                            while (reader.Read())
                            {
                                string ed = (string)reader["stop_date"];

                                PaymentLocation location = new PaymentLocation()
                                {
                                    ID = (double)reader["id"],
                                    Vender = (string)reader["vendor"],
                                    Agent = (string)reader["agent"],
                                    Name = (string)reader["location_name"],
                                    AddressLine1 = (string)reader["address1"],
                                    AddressLine2 = (string)reader["address2"],
                                    City = (string)reader["city"],
                                    StateAbbreviation = (string)reader["state"],
                                    PostalCode5 = (string)reader["zip"],
                                    PostalCodePlus4 = (string)reader["zip4"],
                                    PhoneNumber = formatPhoneNumber((string)reader["phone"]),
                                    ContactName = (string)reader["contact_name"],
                                    Hours = (string)reader["hours"],
                                    Fee = ((double)reader["fee"]) > 0,
                                    StartDate = DateTime.Parse((string)reader["start_date"]),
                                    EndDate = string.IsNullOrEmpty(ed) || ed == "0000-00-00" ? DateTime.MinValue : DateTime.Parse(ed),
                                    Status = (string)reader["status"],
                                    PaymentMethods = ((string)reader["pay_methods"]).Split(" ".ToCharArray()).ToList(),
                                    Lat = (double)reader["lat"],
                                    Lon = (double)reader["lon"],
                                    Rank = (double)reader["rank"],

                                    Distance = getDistance(centerLoc, new GeoCoordinate((double)reader["lat"], (double)reader["lon"]))
                                };

                                results.Add(location);
                            }
                        }
                    }
                }
            }

            //Sort by distance
            results.Sort((a, b) => a.Distance.CompareTo(b.Distance));

            if (results.Count() > maxResults) {
                results = results.Take(maxResults).ToList();
            }

            if (results != null && results.Count() > 0) {
                setLocationCache(results, key);
            }

            return results;
        }

        private List<PaymentLocation> getCachedResults(string key, out bool cacheExisted) {
            List<PaymentLocation> results = new List<PaymentLocation>();

            string result = cache.StringGet(key);
            cacheExisted = !string.IsNullOrEmpty(result);

            if (string.IsNullOrEmpty(result))
            {
                return new List<PaymentLocation>();
            }

            results = JsonConvert.DeserializeObject<List<PaymentLocation>>(result);

            return results;
        }

        private bool setLocationCache(List<PaymentLocation> locations, string key)
        {
            try
            {
                cache.StringSet(key, JsonConvert.SerializeObject(locations), TimeSpan.FromDays(7));
            }
            catch (Exception)
            {
                //Add logging here
                return false;
            }
            return true;
        }
    }
}
