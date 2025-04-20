namespace API.Image.Model
{
    public class UploadModel
    {
        public string FileType { get; set; } = string.Empty;
        public required IFormFile File { get; set; }
    }
}
