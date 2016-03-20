using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Drawing;
using System.IO;

namespace StreamEnergy.MyStream.Controllers
{
    [RoutePrefix("api/mapserver")]
    public class MapServerController : ApiController
    {

        // GET api/<controller>
        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 2, IsPublic = true)]
        [Route("tile/{tile}/{layers}")]
        public HttpResponseMessage Get(string layers, string tile)
        {
            string key = string.Format("{0}|{1}", layers, tile);
            
            layers = layers.Replace(",", " ");
            tile = tile.Replace(",", "+");
            //string url = "http://127.0.0.1:1025/cgi-bin/mapserv.exe?map=C:/OSGeo4W/mapserver/web/stream.map&mode=tile&tilemode=gmap&tile=" + tile + "&layers=" + layers;

            string url = string.Format("{0}&mode=tile&tilemode=gmap&tile={1}&layers={2}", 
                System.Configuration.ConfigurationManager.AppSettings["MapServerURL"], tile, layers);
          
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
            byte[] data;
            using (WebClient webClient = new WebClient())
            {
                data = webClient.DownloadData(url);

            }

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(data);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/png");
            Console.Write(url);
            return result;
        }
    }
}