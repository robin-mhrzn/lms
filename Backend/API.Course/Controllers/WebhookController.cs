// Controllers/WebhookController.cs

using API.Course.BLL.IService;
using API.Course.Model;
using API.Course.Model.AppSetting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SharedLib;
using SharedLib.Model.Webhook;

[ApiController]
[Route("[controller]")]
public class WebhookController : ControllerBase
{
    private readonly ILogger<WebhookController> _logger;
    private readonly ICourseService _courseService;
    private readonly IUserCourseService _userCourseService;
    private readonly WebHookSetting _webhookSetting;
    public WebhookController(ILogger<WebhookController> logger, ICourseService courseService, IUserCourseService userCourseService, IOptions<WebHookSetting> options)
    {
        _logger = logger;
        _courseService = courseService;
        _webhookSetting = options.Value;
        _userCourseService = userCourseService;
    }

    [HttpPost]
    public async Task<ResponseModel> ReceiveWebhook([FromBody] WebHoookPayloadModel payload)
    {
        var signature = Request.Headers["X-API-KEY"].FirstOrDefault();
        if (!IsValidSignature(signature))
        {
            return new ResponseModel(false, "Invalid signature");
        }

        if (SharedEnums.WebhookName.CourseCheck.ToString().Equals(payload.Name))
        {

            var payloadData = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckCourseModel>(payload.Data.ToString());
            var data = await _courseService.CheckCoursePrice(payloadData.UserId, payloadData.CourseId);
            return data;
        }
        else if (SharedEnums.WebhookName.PurchaseCourse.ToString().Equals(payload.Name))
        {
            var userCourseModel = Newtonsoft.Json.JsonConvert.DeserializeObject<UserCourseModel>(payload.Data.ToString());
            return await _userCourseService.AddCourse(userCourseModel);
        }
        else if (SharedEnums.WebhookName.CourseList.ToString().Equals(payload.Name))
        {
            var items = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(payload.Data.ToString());
            return await _courseService.GetCourseData(items.ToArray());
        }
        return new ResponseModel(false, "invalid request");
    }
    private bool IsValidSignature(string signature)
    {
        if (signature == _webhookSetting.SIGNATURE)
        {
            return true;
        }
        return false;

    }
}
