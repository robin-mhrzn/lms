namespace API.Image.Model
{
    public class UploadModel
    {
        public string FileType { get; set; } = string.Empty;
        public IFormFile File { get; set; }
    }
}
