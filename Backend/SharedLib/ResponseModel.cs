namespace SharedLib
{
    public class ResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public object? Data { get; set; } 
        public ResponseModel(bool success,string message,object? data =null) {
            this.Success = success;
            this.Message = message;
            this.Data = data;
        }
    }
}
