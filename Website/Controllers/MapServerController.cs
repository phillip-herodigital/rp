using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Drawing;
using System.IO;
using System.Data.SqlClient;
using System.Data.Sql;
using System.Configuration;
using StackExchange.Redis;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;

namespace StreamEnergy.MyStream.Controllers
{
    [RoutePrefix("api/mapserver")]
    public class MapServerController : ApiController
    {
        private readonly IDatabase redis;
        private readonly IUnityContainer container;
        private ConnectionMultiplexer Connection;
        private IDatabase cache;
        public MapServerController(IUnityContainer container, IDatabase redis) {
            this.container = container;
            this.redis = redis;
        }

        // GET api/<controller>
        [HttpGet]
        [Route("tile/{tile}/{layers}")]
        public HttpResponseMessage Get(string layers, string tile)
        {
            string key = string.Format("{0}|{1}", layers, tile);
            byte[] data;

            Connection = ConnectionMultiplexer.Connect(ConfigurationManager.ConnectionStrings["mapServerCache"].ConnectionString);
            cache = Connection.GetDatabase();

            layers = layers.Replace(",", " ");
            tile = tile.Replace(",", "+");


            //Check cache for tile
            data = GetCacheTile(key, cache);

            if (data == null || data.Length < 1) //It is not in cache.  Get and store it.
            {
                data = LoadTileFromServer(key, layers, tile);
            }

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(data);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");

            return result;
        }

        private byte[] GetCacheTile(string key, IDatabase cache) {
            string result = cache.StringGet(key);

            if (string.IsNullOrEmpty(result))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<byte[]>(result);
        }

        private byte[] LoadTileFromServer(string key, string layers, string tile) {
            DateTime start = DateTime.Now;
            byte[] data;
            string url = string.Format("{0}&mode=tile&tilemode=gmap&tile={1}&layers={2}",
                ConfigurationManager.AppSettings["MapServerURL"], tile, layers);

            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);

            using (WebClient webClient = new WebClient())
            {
                data = webClient.DownloadData(url);

            }

            setTileCache(data, key);
            
            return data;
        }

        private bool setTileCache(byte[] data, string key) {
            try
            {
                cache.StringSet(key, JsonConvert.SerializeObject(data));
            }
            catch (Exception e) {
                //Add logging here
                return false;
            }
            return true;
        }
    }
}