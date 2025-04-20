using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedLib.Model.Webhook
{
    public class WebHoookPayloadModel
    {
        public string Name { get; set; } = string.Empty;
        public required object Data { get; set; }
    }
}
