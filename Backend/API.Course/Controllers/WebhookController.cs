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
        if (string.IsNullOrEmpty(signature) || !IsValidSignature(signature))
        {
            return new ResponseModel(false, "Invalid signature");
        }

        if (Enum.TryParse<SharedEnums.WebhookName>(payload.Name, out var webhookName))
        {
            switch (webhookName)
            {
                case SharedEnums.WebhookName.CourseCheck:
                    var checkCourseModel = Newtonsoft.Json.JsonConvert.DeserializeObject<CheckCourseModel>(payload.Data.ToString());
                    return await _userCourseService.CheckCoursePrice(checkCourseModel.UserId, checkCourseModel.CourseId);

                case SharedEnums.WebhookName.PurchaseCourse:
                    var userCourseModel = Newtonsoft.Json.JsonConvert.DeserializeObject<UserCourseModel>(payload.Data.ToString());
                    return await _userCourseService.AddCourse(userCourseModel);

                case SharedEnums.WebhookName.CourseList:
                    var courseIds = Newtonsoft.Json.JsonConvert.DeserializeObject<List<int>>(payload.Data.ToString());
                    return await _courseService.GetCourseData(courseIds.ToArray());

                case SharedEnums.WebhookName.PurchaseCourseDetail:
                    var purchaseDetailModel = Newtonsoft.Json.JsonConvert.DeserializeObject<UserCourseModel>(payload.Data.ToString());
                    return await _userCourseService.GetPurchaseCourseDetail(purchaseDetailModel.UserId, purchaseDetailModel.CourseId);

                case SharedEnums.WebhookName.PurchaseCourseModuleDetail:
                    var moduleDetailModel = Newtonsoft.Json.JsonConvert.DeserializeObject<WebhookCourseModuleDetailModel>(payload.Data.ToString());
                    return await _userCourseService.GetPurchaseCourseModule(moduleDetailModel);

                default:
                    return new ResponseModel(false, "Invalid request");
            }
        }
        return new ResponseModel(false, "Invalid request");
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
