using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace StreamEnergy.Services
{
    static class HttpConverter
    {
        static readonly Regex httpResponseStatusLine = new Regex("^(?<protocol>[^/]+)/(?<version>[0-9.]+) (?<status>[0-9]{3})(?: (?<message>.*))?", RegexOptions.Compiled);
        static readonly Regex httpResponseHeader = new Regex("^(?<header>[^:]+): (?<value>.*)$", RegexOptions.Compiled);
        static string crlf = "\r\n";

        public static async Task<string> ToString(System.Net.Http.HttpRequestMessage request)
        {
            var content = "";
            if (request.Content != null)
                content = await request.Content.ReadAsStringAsync();
            return request.Method + " " + request.RequestUri.PathAndQuery + crlf +
                "Host " + request.RequestUri.Host + crlf +
                request.Headers.ToString() + crlf +
                content;
        }

        public static async Task<string> ToString(System.Net.Http.HttpResponseMessage response)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("HTTP/").Append(response.Version.ToString()).Append(" ").Append((int)response.StatusCode).Append(" ").Append(response.ReasonPhrase).Append(crlf);
            foreach (var header in response.Headers.Concat(response.Content.Headers))
            {
                foreach (var value in header.Value)
                {
                    sb.Append(header.Key).Append(": ").Append(value).Append(crlf);
                }
            }
            sb.Append(crlf);

            var content = await response.Content.ReadAsStringAsync();
            sb.Append(content);

            return sb.ToString();
        }

        public static async Task<object> ToObject(System.Net.Http.HttpRequestMessage request)
        {
            object content = null;
            if (request.Content != null)
            {
                content = await request.Content.ReadAsStringAsync();
                if (request.Content.Headers.ContentType.MediaType.EndsWith("/json"))
                {
                    content = Json.Read<Newtonsoft.Json.Linq.JToken>((string)content);
                }
            }

            return new
            {
                Method = request.Method,
                Uri = request.RequestUri,
                Headers = request.Headers.ToArray(),
                Content = content
            };
        }

        public static async Task<object> ToObject(System.Net.Http.HttpResponseMessage response)
        {
            object content = null;
            if (response.Content != null)
            {
                content = await response.Content.ReadAsStringAsync();
                if (response.Content.Headers.ContentType != null && response.Content.Headers.ContentType.MediaType.EndsWith("/json"))
                {
                    content = Json.Read<Newtonsoft.Json.Linq.JToken>((string)content);
                }
            }

            return new
            {
                Headers = response.Headers.ToArray(),
                Content = content
            };
        }

        public static System.Net.Http.HttpResponseMessage ParseResponse(string responseString)
        {
            var result = new System.Net.Http.HttpResponseMessage();

            var lines = responseString.Split(new[] { crlf }, StringSplitOptions.None).TakeWhile(line => !string.IsNullOrEmpty(line)).ToArray();

            var match = httpResponseStatusLine.Match(lines[0]);
            result.Version = Version.Parse(match.Groups["version"].Value);
            result.StatusCode = (System.Net.HttpStatusCode)int.Parse(match.Groups["status"].Value);
            result.ReasonPhrase = match.Groups["message"].Value;

            var remainder = responseString.Substring(string.Join(crlf, lines).Length + 4);

            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);
            writer.Write(remainder);
            writer.Flush();
            stream.Position = 0;

            result.Content = new System.Net.Http.StreamContent(stream);

            var headers = new System.Net.Http.Headers.HttpHeaders[] { result.Headers, result.Content.Headers };
            foreach (var header in from line in lines.Skip(1)
                                   let header = httpResponseHeader.Match(line)
                                   group header.Groups["value"].Value by header.Groups["header"].Value)
            {
                headers.First(h => h.TryAddWithoutValidation(header.Key, header));
            }

            return result;
        }

    }
}
