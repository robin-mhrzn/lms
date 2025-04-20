using RestSharp;

namespace SharedLib.Helper
{
    public class RestSharpHelper
    {
        private readonly RestClient _client;

        public RestSharpHelper(string baseUrl)
        {
            _client = new RestClient(baseUrl);
        }

        public async Task<T?> GetAsync<T>(string endpoint, Dictionary<string, string> header, object? queryParams = null) where T : class
        {
            var request = new RestRequest(endpoint, Method.Get);
            if (queryParams != null)
            {
                foreach (var param in queryParams.GetType().GetProperties())
                {
                    request.AddQueryParameter(param.Name, param.GetValue(queryParams)?.ToString());
                }
            }

            var response = await _client.ExecuteAsync<T>(request);
            return HandleResponse(response);
        }

        public async Task<T?> PostAsync<T>(string endpoint, Dictionary<string, string> header, object body) where T : class
        {
            var request = new RestRequest(endpoint, Method.Post);
            request.AddJsonBody(body);
            foreach(var headerItem in header)
            {
                request.AddHeader(headerItem.Key, headerItem.Value);
            }
            var response = await _client.ExecuteAsync<T>(request);
            return HandleResponse(response);
        }

        public async Task<T?> PutAsync<T>(string endpoint, Dictionary<string, string> header, object body) where T : class
        {
            var request = new RestRequest(endpoint, Method.Put);
            request.AddJsonBody(body);

            var response = await _client.ExecuteAsync<T>(request);
            return HandleResponse(response);
        }

        public async Task<T?> DeleteAsync<T>(string endpoint, Dictionary<string, string> header, object? queryParams = null) where T : class
        {
            var request = new RestRequest(endpoint, Method.Delete);
            if (queryParams != null)
            {
                foreach (var param in queryParams.GetType().GetProperties())
                {
                    request.AddQueryParameter(param.Name, param.GetValue(queryParams)?.ToString());
                }
            }

            var response = await _client.ExecuteAsync<T>(request);
            return HandleResponse(response);
        }

        private T? HandleResponse<T>(RestResponse<T> response) where T : class
        {
            if (response.IsSuccessful)
            {
                return response.Data;
            }
            else
            {
                throw new Exception($"Error: {response.StatusCode}, Message: {response.ErrorMessage}");
            }
        }
    }
}